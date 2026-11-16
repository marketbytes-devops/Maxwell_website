import uuid
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status

from app.auth import get_current_admin
from app.config import PRODUCT_UPLOADS_DIR

router = APIRouter(prefix="/api/admin", tags=["admin-upload"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


async def _save_image_file(upload: UploadFile) -> str:
    ext = Path(upload.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        if upload.content_type == "image/jpeg":
            ext = ".jpg"
        elif upload.content_type == "image/png":
            ext = ".png"
        elif upload.content_type == "image/webp":
            ext = ".webp"
        elif upload.content_type == "image/gif":
            ext = ".gif"
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file type '{upload.filename}'. Allowed: jpg, jpeg, png, webp, gif.",
            )

    if upload.content_type and upload.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid image MIME type: {upload.content_type}",
        )

    content = await upload.read()
    if not content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty")
    if len(content) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image size exceeds 10 MB limit",
        )

    PRODUCT_UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid.uuid4().hex}{ext}"
    dest = PRODUCT_UPLOADS_DIR / filename
    dest.write_bytes(content)

    return f"/uploads/products/{filename}"


@router.post("/upload")
async def upload_product_images(
    files: list[UploadFile] = File(default=[]),
    file: UploadFile | None = File(default=None),
    _admin: dict = Depends(get_current_admin),
):
    incoming: list[UploadFile] = []
    if file is not None:
        incoming.append(file)
    if files:
        incoming.extend(files)

    if not incoming:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No image file provided")

    urls = [await _save_image_file(item) for item in incoming]
    return {"success": True, "url": urls[0], "urls": urls}
