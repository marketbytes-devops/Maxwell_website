import io
import json
import os
import re
from typing import Any
from fastapi import APIRouter, Depends, File, Form, Header, HTTPException, UploadFile, status
from pydantic import BaseModel
from PIL import Image

from app.auth import get_current_admin
from app.config import ROOT_DIR

router = APIRouter(prefix="/api/admin", tags=["admin-ai-extractor"])

EXTRACTION_SYSTEM_PROMPT = """You are an expert commercial kitchen, bakery, refrigeration, and foodservice equipment catalog specialist.
Analyze this specification sheet / technical table / brochure image.

Extract all equipment details into strict, valid JSON with this exact structure:
{
  "model_no": "Primary model number/identifier detected (e.g. Prodigy – Convex, Prodigy – Pro, F450GL23, BB-3D-GLS)",
  "name": "Product title/name (e.g. Prodigy – Convex, Prodigy – Pro, Western 300L Hard Top Deep Freezer)",
  "description": "If the sheet contains marketing copy, an introductory overview, category subtitle (e.g. 'Modular Electric Convection Ovens', 'Modular Proofing Cabinets'), or descriptive paragraphs explaining construction, features, and applications, extract the complete text here as formatted paragraphs. If the sheet is strictly a technical spec table with NO description paragraphs (like Western or Hoshizaki spec tables), return an empty string \"\". Do NOT hallucinate marketing text if absent.",
  "tags": "Comma-separated keywords (e.g. Convection Oven, Proofing Cabinet, Bakery Equipment, Stainless Steel)",
  "specs": [
    { "key": "Power", "value": "6.0 kW" },
    { "key": "Dimensions (W x D x H)", "value": "840 x 849 x 789 mm" },
    { "key": "Cavity Dimensions (W x D x H)", "value": "663 x 481 x 584 mm" },
    { "key": "Weight", "value": "91.0 kgs." },
    { "key": "Electricals", "value": "3-380V / 50Hz" }
  ],
  "all_models": [
    {
      "model_no": "Model name/number if multiple models appear in table columns (e.g. Prodigy – Convex, Prodigy – Deck)",
      "name": "Product title for this model",
      "description": "Description if model-specific",
      "specs": [
        { "key": "Parameter name", "value": "Value with unit" }
      ]
    }
  ]
}

Extraction Guidelines:
1. Model & Name:
   - Look for the product headline or 'Model :' field (e.g. 'Prodigy – Convex', 'Prodigy – Pro').
   - If both a product family title ('Prodigy – Convex') and subtitle ('Modular Electric Convection Ovens') are present, set `name` to the product title ('Prodigy – Convex') and include the subtitle and full body text in `description`.
   - If the image only has a model code in a table (e.g. 'F450GL23'), set both `model_no` and `name` to that code.
2. Description:
   - Extract the full textual narrative from the sheet if present (e.g. overview, key highlights, suitability for bakeries/cafes/restaurants).
   - If there is NO descriptive text (only tabular data), leave `description` as empty string `""`.
3. Specifications / Key Features:
   - Extract every key feature and specification row (e.g. Power, Weight, Dimensions (W x D x H), Cavity Dimensions (W x D x H), Electricals, Temperature, Trays, Gross Volume, Temperature Range, etc.).
   - Keep key names clean and natural as they appear on the sheet.
4. Multi-model tables:
   - If the image contains multiple models (e.g. multiple columns or side-by-side models), list each model in `all_models` with its specific specs.
5. Return pure, valid JSON ONLY without any markdown code fences or conversational text.
"""


def _get_active_gemini_key(header_key: str | None = None, form_key: str | None = None) -> str:
    # 1. Header or form key
    key = (header_key or form_key or "").strip()
    if key:
        return key

    # 2. Environment variables
    env_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or ""
    if env_key.strip():
        return env_key.strip()

    # 3. Check .env.local in workspace root
    env_local_path = ROOT_DIR / ".env.local"
    if env_local_path.exists():
        try:
            content = env_local_path.read_text(encoding="utf-8")
            for line in content.splitlines():
                line = line.strip()
                if line.startswith("GEMINI_API_KEY=") or line.startswith("GOOGLE_API_KEY="):
                    k = line.split("=", 1)[1].strip().strip('"').strip("'")
                    if k:
                        return k
        except Exception:
            pass

    return ""


def _save_key_to_local_env(key: str) -> None:
    env_local_path = ROOT_DIR / ".env.local"
    try:
        content = ""
        if env_local_path.exists():
            content = env_local_path.read_text(encoding="utf-8")

        if "GEMINI_API_KEY=" in content:
            new_content = re.sub(r"GEMINI_API_KEY=.*", f"GEMINI_API_KEY={key}", content)
        else:
            new_content = content + f"\nGEMINI_API_KEY={key}\n"

        env_local_path.write_text(new_content, encoding="utf-8")
        os.environ["GEMINI_API_KEY"] = key
    except Exception as e:
        print(f"Warning: Could not save GEMINI_API_KEY to .env.local: {e}")


@router.get("/ai-status")
def get_ai_status(current_user: dict = Depends(get_current_admin)):
    key = _get_active_gemini_key()
    return {
        "configured": bool(key),
        "has_key": bool(key),
        "key_preview": f"{key[:4]}...{key[-4:]}" if len(key) >= 8 else None,
    }


@router.post("/set-gemini-key")
def set_gemini_key(
    payload: dict,
    current_user: dict = Depends(get_current_admin),
):
    key = (payload.get("key") or payload.get("api_key") or "").strip()
    if not key:
        raise HTTPException(status_code=400, detail="API key is required")

    _save_key_to_local_env(key)
    return {"success": True, "message": "Gemini API Key configured successfully."}


@router.post("/extract-specs")
async def extract_specs_from_image(
    file: UploadFile = File(...),
    gemini_key: str | None = Form(None),
    x_gemini_key: str | None = Header(None, alias="X-Gemini-Key"),
    current_user: dict = Depends(get_current_admin),
):
    api_key = _get_active_gemini_key(header_key=x_gemini_key, form_key=gemini_key)

    if not api_key:
        return {
            "success": False,
            "requires_key": True,
            "error": "Gemini API Key is not configured. Please enter your Google Gemini API key to enable instant specification scanning.",
        }

    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file must be an image (PNG, JPG, WEBP).",
        )

    image_bytes = await file.read()
    if not image_bytes:
        return {"success": False, "error": "Uploaded file is empty."}

    try:
        image = Image.open(io.BytesIO(image_bytes))
        # Convert RGBA to RGB for standard processing if needed
        if image.mode in ("RGBA", "LA", "P"):
            image = image.convert("RGB")

        # Downsample high-res images to max 1600px dimension
        # Keeps OCR crisp while reducing payload from 5-10MB to <300KB and speeding up by 5x-10x
        MAX_DIM = 1600
        if max(image.width, image.height) > MAX_DIM:
            image.thumbnail((MAX_DIM, MAX_DIM), Image.Resampling.LANCZOS)
    except Exception as e:
        return {"success": False, "error": f"Invalid image format: {e}"}

    try:
        try:
            from google import genai
        except ImportError:
            return {
                "success": False,
                "error": "The google-genai library is not installed in the backend environment. Please run: docker compose up -d --build backend",
            }

        client = genai.Client(api_key=api_key)

        # Call Gemini multimodal model with fast, high-availability candidates
        candidate_models = ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-2.5-flash-lite"]
        response = None
        last_err = None
        for m_name in candidate_models:
            for attempt in range(2):
                try:
                    response = client.models.generate_content(
                        model=m_name,
                        contents=[image, EXTRACTION_SYSTEM_PROMPT],
                    )
                    if response and response.text:
                        break
                except Exception as e:
                    last_err = e
                    err_str = str(e)
                    # If 429 rate limit or 503 high demand, short pause before next attempt
                    if ("429" in err_str or "503" in err_str or "UNAVAILABLE" in err_str) and attempt == 0:
                        import time
                        time.sleep(1.5)
                        continue
                    break
            if response and response.text:
                break

        if not response or not response.text:
            err_str = str(last_err or "")
            if "RESOURCE_EXHAUSTED" in err_str or "429" in err_str:
                return {
                    "success": False,
                    "error": "Gemini API rate limit reached (requests per minute limit). Please wait 20 seconds and click scan again.",
                }
            if "503" in err_str or "UNAVAILABLE" in err_str or "high demand" in err_str.lower():
                return {
                    "success": False,
                    "error": "Google Gemini servers are momentarily experiencing high traffic. Please wait 10 seconds and try again.",
                }
            return {
                "success": False,
                "error": f"AI extraction error: {err_str or 'No response received from Gemini'}",
            }

        raw_text = (response.text or "").strip()
        # Clean any accidental markdown code fences
        cleaned = re.sub(r"^```(?:json)?\s*", "", raw_text, flags=re.MULTILINE)
        cleaned = re.sub(r"\s*```$", "", cleaned, flags=re.MULTILINE).strip()

        data = json.loads(cleaned)

        # Normalize specs array
        specs = data.get("specs", [])
        if not isinstance(specs, list):
            specs = []

        all_models = data.get("all_models", [])
        if not isinstance(all_models, list):
            all_models = []

        # Normalize tags
        tags_val = data.get("tags", "")
        if isinstance(tags_val, list):
            tags_val = ", ".join(str(t) for t in tags_val)
        elif not isinstance(tags_val, str):
            tags_val = str(tags_val or "")

        result_payload = {
            "model_no": str(data.get("model_no") or "").strip(),
            "name": str(data.get("name") or "").strip(),
            "description": str(data.get("description") or "").strip(),
            "tags": tags_val.strip(),
            "specs": specs,
            "all_models": all_models,
            "raw_detected": len(specs),
        }

        # Ensure active key is persisted if passed in request
        if gemini_key:
            _save_key_to_local_env(gemini_key)

        return {
            "success": True,
            "data": result_payload,
            **result_payload,
        }

    except json.JSONDecodeError:
        return {
            "success": False,
            "error": "Could not parse JSON from table scan. Please try a clearer screenshot of the table.",
            "raw": raw_text,
        }
    except Exception as e:
        err_msg = str(e)
        if "API_KEY_INVALID" in err_msg or "403" in err_msg or "unauthenticated" in err_msg.lower():
            return {
                "success": False,
                "requires_key": True,
                "error": "The provided Gemini API Key was invalid or expired. Please check your key at Google AI Studio.",
            }
        return {
            "success": False,
            "error": f"AI Table Scan Error: {err_msg}",
        }
