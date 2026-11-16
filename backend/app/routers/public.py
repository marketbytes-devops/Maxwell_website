from typing import Any
from fastapi import APIRouter, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import text

from app.category_utils import (
    attach_product_details,
    build_category_tree,
    get_descendant_category_ids,
)
from app.database import get_engine, init_db

router = APIRouter(prefix="/api", tags=["public"])


class EnquiryItemInput(BaseModel):
    id: int | str | None = None
    name: str = "Unknown Product"
    model_no: str = ""
    category_name: str = ""
    price: float = 0.0
    quantity: int = 1


class EnquiryCreate(BaseModel):
    fullName: str
    phoneNumber: str
    email: str
    productCategory: str = ""
    requirements: str = ""
    items: list[EnquiryItemInput] = Field(default_factory=list)


@router.get("/brands")
def get_public_brands():
    init_db()
    engine = get_engine()
    with engine.connect() as conn:
        rows = conn.execute(
            text("SELECT id, name FROM brands ORDER BY name ASC")
        ).mappings().all()
    return {"success": True, "brands": [dict(r) for r in rows]}


@router.get("/categories")
def get_public_categories(
    brand_id: int | None = Query(default=None),
    as_tree: bool = Query(default=False),
):
    init_db()
    engine = get_engine()
    with engine.connect() as conn:
        sql = """
            SELECT c.id, c.brand_id, c.parent_id, c.name, c.slug, c.level,
                   c.capacity_note, c.is_new, c.sort_order,
                   b.name AS brand_name,
                   (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id) AS product_count
            FROM categories c
            LEFT JOIN brands b ON c.brand_id = b.id
            WHERE 1=1
        """
        params: dict[str, Any] = {}
        if brand_id:
            sql += " AND c.brand_id = :brand_id"
            params["brand_id"] = brand_id

        sql += " ORDER BY c.brand_id ASC, c.level ASC, c.sort_order ASC, c.name ASC"
        rows = conn.execute(text(sql), params).mappings().all()
        cat_list = [dict(r) for r in rows]

        if as_tree:
            tree = build_category_tree(cat_list)
            return {"success": True, "categories": tree}

        # Build full_path
        cat_by_id = {c["id"]: c for c in cat_list}
        for c in cat_list:
            chain = [c["name"]]
            curr_pid = c.get("parent_id")
            visited = set()
            while curr_pid and curr_pid in cat_by_id and curr_pid not in visited:
                visited.add(curr_pid)
                chain.append(cat_by_id[curr_pid]["name"])
                curr_pid = cat_by_id[curr_pid].get("parent_id")
            chain.reverse()
            c["full_path"] = " > ".join(chain)

    return {"success": True, "categories": cat_list}


@router.get("/products")
def get_public_products(
    category: str | None = Query(default=None),
    category_id: int | None = Query(default=None),
    brand_id: int | None = Query(default=None),
    brand: str | None = Query(default=None),
    search: str | None = Query(default=None),
):
    init_db()
    engine = get_engine()
    with engine.connect() as conn:
        sql = """
            SELECT p.id, p.model_no, p.name, p.brand_id, p.brand, p.category_id, p.category_name,
                   p.description, p.tags, p.image_url, p.brochure_url, p.is_featured, p.created_at
            FROM products p
            WHERE 1=1
        """
        params: dict[str, Any] = {}

        if brand_id:
            sql += " AND p.brand_id = :brand_id"
            params["brand_id"] = brand_id
        elif brand and brand.strip() and brand.lower() != "all":
            sql += " AND LOWER(p.brand) = :brand"
            params["brand"] = brand.strip().lower()

        if category_id:
            # Match this category and ALL subcategories recursively
            cat_ids = get_descendant_category_ids(conn, category_id)
            if cat_ids:
                in_clause = ",".join(str(cid) for cid in cat_ids)
                sql += f" AND p.category_id IN ({in_clause})"
        elif category and category.strip() and category.lower() != "all":
            # Match by name or slug
            cat_match = conn.execute(
                text("SELECT id FROM categories WHERE LOWER(name) = :cat OR LOWER(slug) = :cat"),
                {"cat": category.strip().lower()},
            ).fetchall()
            if cat_match:
                all_ids = []
                for (cid,) in cat_match:
                    all_ids.extend(get_descendant_category_ids(conn, cid))
                in_clause = ",".join(str(cid) for cid in set(all_ids))
                sql += f" AND (p.category_id IN ({in_clause}) OR LOWER(p.category_name) = :cat)"
                params["cat"] = category.strip().lower()
            else:
                sql += " AND LOWER(p.category_name) = :cat"
                params["cat"] = category.strip().lower()

        if search and search.strip():
            sql += " AND (LOWER(p.model_no) LIKE :q OR LOWER(p.name) LIKE :q OR LOWER(p.tags) LIKE :q OR LOWER(p.brand) LIKE :q)"
            params["q"] = f"%{search.strip().lower()}%"

        sql += " ORDER BY p.is_featured DESC, p.id DESC"
        rows = conn.execute(text(sql), params).mappings().all()
        products = attach_product_details(conn, [dict(r) for r in rows])

    return {"success": True, "products": products, "total": len(products)}


@router.get("/products/{identifier}")
def get_public_product_detail(identifier: str):
    init_db()
    engine = get_engine()
    with engine.connect() as conn:
        row = None
        if identifier.isdigit():
            row = conn.execute(
                text("SELECT * FROM products WHERE id = :id LIMIT 1"),
                {"id": int(identifier)},
            ).mappings().first()

        if not row:
            row = conn.execute(
                text("SELECT * FROM products WHERE model_no = :m LIMIT 1"),
                {"m": identifier},
            ).mappings().first()

        if not row:
            raise HTTPException(status_code=404, detail="Product not found")

        products = attach_product_details(conn, [dict(row)])
        product = products[0]

    return {"success": True, "product": product}


@router.post("/enquiries")
def create_enquiry(payload: EnquiryCreate):
    name = payload.fullName.strip()
    phone = payload.phoneNumber.strip()
    email = payload.email.strip()

    if not name or not phone or not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name, phone number, and email are required.",
        )

    init_db()
    total_items = sum(it.quantity for it in payload.items) if payload.items else 0

    engine = get_engine()
    with engine.begin() as conn:
        res = conn.execute(
            text(
                """
                INSERT INTO enquiries (full_name, phone_number, email, product_category, requirements, total_items)
                VALUES (:full_name, :phone, :email, :cat, :req, :total)
                """
            ),
            {
                "full_name": name,
                "phone": phone,
                "email": email,
                "cat": payload.productCategory or "",
                "req": payload.requirements or "",
                "total": total_items,
            },
        )
        enquiry_id = res.lastrowid

        for item in payload.items:
            conn.execute(
                text(
                    """
                    INSERT INTO enquiry_items (enquiry_id, product_id, product_name, model_no, category_name, price, quantity)
                    VALUES (:eid, :pid, :name, :model, :cat, :price, :qty)
                    """
                ),
                {
                    "eid": enquiry_id,
                    "pid": int(item.id) if str(item.id).isdigit() else None,
                    "name": item.name,
                    "model": item.model_no,
                    "cat": item.category_name,
                    "price": item.price,
                    "qty": item.quantity,
                },
            )

    return {
        "success": True,
        "message": "Enquiry received successfully",
        "enquiryId": enquiry_id,
    }

