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
Analyze this specification sheet / technical table image.

Extract all equipment details into strict, valid JSON with this exact structure:
{
  "model_no": "Primary or first model number detected (e.g. WHF300, F450GL, BB-3D-GLS)",
  "name": "Professional product title/name (e.g. Western 300L Hard Top Deep Freezer)",
  "description": "Concise 1-2 sentence commercial overview describing the equipment type and intended use",
  "tags": "Comma-separated keywords (e.g. Deep Freezer, Hard Top, Commercial Kitchen, R290)",
  "specs": [
    { "key": "External Dimension (mm)", "value": "1100 x 680 x 850" },
    { "key": "Gross Volume", "value": "300 Litres" },
    { "key": "Temperature Range", "value": "-18°C to -24°C" }
  ],
  "all_models": [
    {
      "model_no": "Model name/number if multiple models appear in table columns",
      "name": "Suggested product title for this model",
      "specs": [
        { "key": "Parameter name", "value": "Value with unit" }
      ]
    }
  ]
}

Extraction Guidelines:
1. Normalize standard specification keys where possible:
   - Dimensions, WxDxH, Size (mm) -> "External Dimension (mm)"
   - Gross Volume, Capacity, Volume (L) -> "Gross Volume"
   - Temperature Range, Operating Temp -> "Temperature Range"
   - Shelves, Baskets -> "No. of Shelves / Baskets"
   - Power Supply, Voltage, Electrical Rating -> "Power Supply / Voltage"
   - Refrigerant, Gas -> "Refrigerant"
   - Power Consumption, Energy -> "Power Consumption"
   - Insulation, Thickness -> "Insulation Thickness"
   - Net Weight, Weight -> "Net Weight"
2. Keep all other technical rows detected in the table (e.g. Defrost Type, Door Type, Lock, Wheels/Castors).
3. If the image shows a multi-column table with multiple models (e.g. Model A, Model B, Model C side-by-side):
   - Put every detected model in the `all_models` list with its corresponding column values.
   - Set the root `model_no` and `specs` to the first model in the table.
4. Return pure, valid JSON ONLY without any markdown code fences or conversational text.
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
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    try:
        image = Image.open(io.BytesIO(image_bytes))
        # Convert RGBA to RGB for standard processing if needed
        if image.mode in ("RGBA", "LA", "P"):
            image = image.convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image format: {e}")

    try:
        from google import genai
        client = genai.Client(api_key=api_key)

        # Call Gemini multimodal model with fallback for high availability
        candidate_models = ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-3.8-flash"]
        response = None
        last_err = None
        for m_name in candidate_models:
            try:
                response = client.models.generate_content(
                    model=m_name,
                    contents=[image, EXTRACTION_SYSTEM_PROMPT],
                )
                if response and response.text:
                    break
            except Exception as e:
                last_err = e
                continue

        if not response or not response.text:
            raise HTTPException(
                status_code=500,
                detail=f"Gemini API returned an error: {last_err or 'Empty response'}"
            )

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
