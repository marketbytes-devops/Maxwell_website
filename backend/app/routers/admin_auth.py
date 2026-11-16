from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel
from sqlalchemy import text

from app.auth import clear_session_cookie, get_current_admin, set_session_cookie
from app.database import get_engine, init_db

router = APIRouter(prefix="/api/admin", tags=["admin-auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
def login(payload: LoginRequest, response: Response):
    init_db()
    email = payload.email.strip()
    password = payload.password

    if not email or not password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email and password are required")

    engine = get_engine()
    with engine.connect() as conn:
        row = conn.execute(
            text("SELECT id, email, password, name FROM admins WHERE email = :email LIMIT 1"),
            {"email": email},
        ).mappings().first()

    if not row or row["password"] != password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user = {"id": row["id"], "email": row["email"], "name": row["name"]}
    set_session_cookie(response, user)
    return {"success": True, "user": user}


@router.post("/logout")
def logout(response: Response):
    clear_session_cookie(response)
    return {"success": True}


@router.get("/me")
def me(admin: dict = Depends(get_current_admin)):
    return {"authenticated": True, "user": admin}
