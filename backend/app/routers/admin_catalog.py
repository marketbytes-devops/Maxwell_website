import json
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy import text

from app.auth import get_current_admin
from app.category_utils import (
    attach_product_details,
    build_category_tree,
    get_category_breadcrumb,
    get_descendant_category_ids,
)
from app.database import (
    DEFAULT_13_CATEGORIES,
    get_engine,
    init_db,
    seed_default_categories_for_brand,
    slugify,
)

router = APIRouter(prefix="/api/admin", tags=["admin-catalog"])


# -------------------------------------------------------------
# Pydantic Schemas
# -------------------------------------------------------------
class BrandCreate(BaseModel):
    name: str
    seed_defaults: bool = False


class BrandUpdate(BaseModel):
    name: str


class CategoryCreate(BaseModel):
    brand_id: int
    name: str
    parent_id: int | None = None
    capacity_note: str = ""
    is_new: bool = False
    sort_order: int = 0


class CategoryUpdate(BaseModel):
    name: str
    capacity_note: str | None = None
    is_new: bool | None = None
    sort_order: int | None = None
    parent_id: int | None = None


class ProductSpecItem(BaseModel):
    key: str
    value: str
    display_order: int = 0


class ProductImageItem(BaseModel):
    url: str
    is_primary: bool = False
    display_order: int = 0


class ProductCreate(BaseModel):
    model_no: str | None = None
    name: str | None = None
    brand_id: int | None = None
    brand: str | None = None
    category_id: int | None = None
    category_name: str | None = None
    description: str | None = ""
    tags: str | None = ""
    image_url: str | None = ""
    brochure_url: str | None = ""
    is_featured: bool = False
    images: list[str | ProductImageItem | dict[str, Any]] = Field(default_factory=list)
    specifications: list[dict[str, Any] | ProductSpecItem] = Field(default_factory=list)


class ProductUpdate(BaseModel):
    model_no: str | None = None
    name: str | None = None
    brand_id: int | None = None
    brand: str | None = None
    category_id: int | None = None
    category_name: str | None = None
    description: str | None = ""
    tags: str | None = ""
    image_url: str | None = ""
    brochure_url: str | None = ""
    is_featured: bool = False
    images: list[str | ProductImageItem | dict[str, Any]] = Field(default_factory=list)
    specifications: list[dict[str, Any] | ProductSpecItem] = Field(default_factory=list)


class BatchProductCreate(BaseModel):
    brand_id: int
    brand: str | None = None
    category_id: int
    category_name: str | None = None
    products: list[ProductCreate]


# -------------------------------------------------------------
# Dashboard Stats
# -------------------------------------------------------------
@router.get("/dashboard")
def get_dashboard_data(_admin: dict = Depends(get_current_admin)):
    init_db()
    engine = get_engine()
    with engine.connect() as conn:
        total_products = conn.execute(text("SELECT COUNT(*) FROM products")).scalar() or 0
        total_categories = conn.execute(text("SELECT COUNT(*) FROM categories")).scalar() or 0
        total_brands = conn.execute(text("SELECT COUNT(*) FROM brands")).scalar() or 0
        featured_products = conn.execute(
            text("SELECT COUNT(*) FROM products WHERE is_featured = 1")
        ).scalar() or 0

        categories_summary = conn.execute(
            text(
                """
                SELECT 
                    c.id, c.name, c.slug, c.level, c.brand_id, b.name AS brand_name,
                    COUNT(p.id) AS product_count
                FROM categories c
                LEFT JOIN brands b ON c.brand_id = b.id
                LEFT JOIN products p ON c.id = p.category_id OR c.name = p.category_name
                GROUP BY c.id, c.name, c.slug, c.level, c.brand_id, b.name
                ORDER BY product_count DESC, c.name ASC
                LIMIT 15
                """
            )
        ).mappings().all()

        recent_rows = conn.execute(
            text(
                """
                SELECT id, model_no, name, brand_id, brand, category_id, category_name,
                       tags, image_url, brochure_url, is_featured, created_at
                FROM products
                ORDER BY id DESC
                LIMIT 15
                """
            )
        ).mappings().all()
        recent_products = attach_product_details(conn, [dict(r) for r in recent_rows])

    return {
        "success": True,
        "stats": {
            "totalProducts": total_products,
            "totalCategories": total_categories,
            "totalBrands": total_brands,
            "featuredProducts": featured_products,
        },
        "categories": [dict(c) for c in categories_summary],
        "recentProducts": recent_products,
    }


# -------------------------------------------------------------
# Brands Management
# -------------------------------------------------------------
@router.get("/brands")
def get_admin_brands(_admin: dict = Depends(get_current_admin)):
    init_db()
    engine = get_engine()
    with engine.connect() as conn:
        rows = conn.execute(
            text(
                """
                SELECT b.id, b.name, b.created_at,
                       COUNT(c.id) AS category_count,
                       (SELECT COUNT(*) FROM products p WHERE p.brand_id = b.id OR p.brand = b.name) AS product_count
                FROM brands b
                LEFT JOIN categories c ON b.id = c.brand_id
                GROUP BY b.id, b.name, b.created_at
                ORDER BY b.name ASC
                """
            )
        ).mappings().all()
    return {"success": True, "brands": [dict(r) for r in rows]}


@router.post("/brands")
def create_brand(payload: BrandCreate, _admin: dict = Depends(get_current_admin)):
    init_db()
    name = payload.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Brand name is required")

    engine = get_engine()
    with engine.begin() as conn:
        existing = conn.execute(
            text("SELECT id FROM brands WHERE name = :name LIMIT 1"), {"name": name}
        ).fetchone()
        if existing:
            raise HTTPException(status_code=400, detail=f"Brand '{name}' already exists")

        result = conn.execute(text("INSERT INTO brands (name) VALUES (:name)"), {"name": name})
        brand_id = result.lastrowid

        seeded_count = 0
        if payload.seed_defaults:
            seeded_count = seed_default_categories_for_brand(conn, brand_id)

    return {
        "success": True,
        "brand": {"id": brand_id, "name": name, "seeded_categories": seeded_count},
    }


@router.put("/brands/{brand_id}")
def update_brand(brand_id: int, payload: BrandUpdate, _admin: dict = Depends(get_current_admin)):
    init_db()
    name = payload.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Brand name is required")

    engine = get_engine()
    with engine.begin() as conn:
        brand = conn.execute(text("SELECT id, name FROM brands WHERE id = :id"), {"id": brand_id}).fetchone()
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")

        old_name = brand[1]
        conn.execute(text("UPDATE brands SET name = :name WHERE id = :id"), {"name": name, "id": brand_id})
        # Keep denormalized brand name synced on products
        conn.execute(
            text("UPDATE products SET brand = :name WHERE brand_id = :id OR brand = :old_name"),
            {"name": name, "id": brand_id, "old_name": old_name},
        )

    return {"success": True, "message": "Brand updated successfully"}


@router.delete("/brands/{brand_id}")
def delete_brand(brand_id: int, _admin: dict = Depends(get_current_admin)):
    init_db()
    engine = get_engine()
    with engine.begin() as conn:
        brand = conn.execute(text("SELECT id, name FROM brands WHERE id = :id"), {"id": brand_id}).fetchone()
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")

        # Cascade deletes categories and unlinks or deletes products
        conn.execute(text("DELETE FROM brands WHERE id = :id"), {"id": brand_id})
    return {"success": True, "message": "Brand and its categories deleted"}


@router.post("/brands/{brand_id}/seed-defaults")
def seed_brand_defaults(brand_id: int, _admin: dict = Depends(get_current_admin)):
    init_db()
    engine = get_engine()
    with engine.begin() as conn:
        brand = conn.execute(text("SELECT id, name FROM brands WHERE id = :id"), {"id": brand_id}).fetchone()
        if not brand:
            raise HTTPException(status_code=404, detail="Brand not found")
        count = seed_default_categories_for_brand(conn, brand_id)

    return {"success": True, "message": f"Seeded {count} categories for {brand[1]}", "count": count}


# -------------------------------------------------------------
# Categories Management (Brand -> Category -> Subcategory -> Sub-sub)
# -------------------------------------------------------------
@router.get("/categories")
def get_admin_categories(
    brand_id: int | None = Query(default=None),
    parent_id: int | None = Query(default=None),
    as_tree: bool = Query(default=False),
    _admin: dict = Depends(get_current_admin),
):
    init_db()
    engine = get_engine()
    with engine.connect() as conn:
        query_sql = """
            SELECT c.id, c.brand_id, c.parent_id, c.name, c.slug, c.level,
                   c.capacity_note, c.is_new, c.sort_order, c.created_at,
                   b.name AS brand_name,
                   p.name AS parent_name,
                   (SELECT COUNT(*) FROM products pr WHERE pr.category_id = c.id) AS product_count
            FROM categories c
            LEFT JOIN brands b ON c.brand_id = b.id
            LEFT JOIN categories p ON c.parent_id = p.id
            WHERE 1=1
        """
        params: dict[str, Any] = {}
        if brand_id:
            query_sql += " AND c.brand_id = :brand_id"
            params["brand_id"] = brand_id
        if parent_id is not None:
            query_sql += " AND c.parent_id = :parent_id"
            params["parent_id"] = parent_id

        query_sql += " ORDER BY c.brand_id ASC, c.level ASC, c.sort_order ASC, c.name ASC"
        rows = conn.execute(text(query_sql), params).mappings().all()
        cat_list = [dict(r) for r in rows]

        if as_tree:
            tree = build_category_tree(cat_list)
            return {"success": True, "categories": tree, "total": len(cat_list)}

        # Annotate full path
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

    return {"success": True, "categories": cat_list, "total": len(cat_list)}


@router.post("/categories")
def create_category(payload: CategoryCreate, _admin: dict = Depends(get_current_admin)):
    init_db()
    name = payload.name.strip()
    if not name:
        raise HTTPException(status_code=400, detail="Category name is required")

    engine = get_engine()
    with engine.begin() as conn:
        brand = conn.execute(text("SELECT id FROM brands WHERE id = :id"), {"id": payload.brand_id}).fetchone()
        if not brand:
            raise HTTPException(status_code=400, detail="Specified brand does not exist")

        level = 1
        if payload.parent_id:
            parent = conn.execute(
                text("SELECT id, brand_id, level FROM categories WHERE id = :id"),
                {"id": payload.parent_id},
            ).mappings().first()
            if not parent:
                raise HTTPException(status_code=400, detail="Parent category does not exist")
            if parent["brand_id"] != payload.brand_id:
                raise HTTPException(status_code=400, detail="Parent category belongs to a different brand")
            level = min(parent["level"] + 1, 5)

        base_slug = slugify(name)
        slug = base_slug
        counter = 1
        while True:
            existing_slug = conn.execute(
                text(
                    """
                    SELECT id FROM categories
                    WHERE brand_id = :brand_id AND parent_id IS :parent_id AND slug = :slug
                    """
                    if payload.parent_id is None
                    else
                    """
                    SELECT id FROM categories
                    WHERE brand_id = :brand_id AND parent_id = :parent_id AND slug = :slug
                    """
                ),
                {"brand_id": payload.brand_id, "parent_id": payload.parent_id, "slug": slug},
            ).fetchone()
            if not existing_slug:
                break
            counter += 1
            slug = f"{base_slug}-{counter}"

        result = conn.execute(
            text(
                """
                INSERT INTO categories (brand_id, parent_id, name, slug, level, capacity_note, is_new, sort_order)
                VALUES (:brand_id, :parent_id, :name, :slug, :level, :capacity_note, :is_new, :sort_order)
                """
            ),
            {
                "brand_id": payload.brand_id,
                "parent_id": payload.parent_id,
                "name": name,
                "slug": slug,
                "level": level,
                "capacity_note": payload.capacity_note or "",
                "is_new": 1 if payload.is_new else 0,
                "sort_order": payload.sort_order,
            },
        )
        cat_id = result.lastrowid

    return {
        "success": True,
        "category": {
            "id": cat_id,
            "brand_id": payload.brand_id,
            "parent_id": payload.parent_id,
            "name": name,
            "slug": slug,
            "level": level,
        },
    }


@router.put("/categories/{category_id}")
def update_category(category_id: int, payload: CategoryUpdate, _admin: dict = Depends(get_current_admin)):
    init_db()
    engine = get_engine()
    with engine.begin() as conn:
        cat = conn.execute(
            text("SELECT id, brand_id, parent_id, name, level FROM categories WHERE id = :id"),
            {"id": category_id},
        ).mappings().first()
        if not cat:
            raise HTTPException(status_code=404, detail="Category not found")

        name = payload.name.strip() if payload.name else cat["name"]
        new_parent_id = payload.parent_id if payload.parent_id is not None else cat["parent_id"]

        level = cat["level"]
        if new_parent_id is not None and new_parent_id != cat["parent_id"]:
            if new_parent_id == category_id:
                raise HTTPException(status_code=400, detail="Category cannot be its own parent")
            parent = conn.execute(
                text("SELECT id, level, brand_id FROM categories WHERE id = :id"),
                {"id": new_parent_id},
            ).mappings().first()
            if not parent:
                raise HTTPException(status_code=400, detail="New parent category does not exist")
            level = parent["level"] + 1

        slug = slugify(name)
        conn.execute(
            text(
                """
                UPDATE categories
                SET name = :name,
                    slug = :slug,
                    parent_id = :parent_id,
                    level = :level,
                    capacity_note = COALESCE(:capacity_note, capacity_note),
                    is_new = COALESCE(:is_new, is_new),
                    sort_order = COALESCE(:sort_order, sort_order)
                WHERE id = :id
                """
            ),
            {
                "id": category_id,
                "name": name,
                "slug": slug,
                "parent_id": new_parent_id,
                "level": level,
                "capacity_note": payload.capacity_note,
                "is_new": 1 if payload.is_new else 0 if payload.is_new is not None else None,
                "sort_order": payload.sort_order,
            },
        )
        conn.execute(
            text("UPDATE products SET category_name = :name WHERE category_id = :id"),
            {"name": name, "id": category_id},
        )

    return {"success": True, "message": "Category updated"}


@router.delete("/categories/{category_id}")
def delete_category(category_id: int, _admin: dict = Depends(get_current_admin)):
    init_db()
    engine = get_engine()
    with engine.begin() as conn:
        cat = conn.execute(text("SELECT id FROM categories WHERE id = :id"), {"id": category_id}).fetchone()
        if not cat:
            raise HTTPException(status_code=404, detail="Category not found")

        # Cascade deletes descendant subcategories
        conn.execute(text("DELETE FROM categories WHERE id = :id"), {"id": category_id})
    return {"success": True, "message": "Category and all child subcategories deleted"}


# -------------------------------------------------------------
# Products Management
# -------------------------------------------------------------
@router.get("/products")
def get_admin_products(
    brand_id: int | None = Query(default=None),
    category_id: int | None = Query(default=None),
    search: str | None = Query(default=None),
    _admin: dict = Depends(get_current_admin),
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

        if category_id:
            cat_ids = get_descendant_category_ids(conn, category_id)
            if cat_ids:
                in_clause = ",".join(str(cid) for cid in cat_ids)
                sql += f" AND p.category_id IN ({in_clause})"

        if search and search.strip():
            sql += " AND (p.model_no LIKE :search OR p.name LIKE :search OR p.tags LIKE :search)"
            params["search"] = f"%{search.strip()}%"

        sql += " ORDER BY p.id DESC"
        rows = conn.execute(text(sql), params).mappings().all()
        products = attach_product_details(conn, [dict(r) for r in rows])

    return {"success": True, "products": products, "total": len(products)}


@router.post("/products")
def create_product(payload: ProductCreate, _admin: dict = Depends(get_current_admin)):
    init_db()
    model_no = payload.model_no.strip() if payload.model_no else f"PROD-{slugify(payload.name or 'item')[:6].upper()}"
    name = (payload.name or model_no).strip()

    engine = get_engine()
    with engine.begin() as conn:
        # Check duplicate model
        existing = conn.execute(
            text("SELECT id FROM products WHERE model_no = :model_no"), {"model_no": model_no}
        ).fetchone()
        if existing:
            raise HTTPException(
                status_code=400, detail=f"Product with model number '{model_no}' already exists"
            )

        brand_name = payload.brand
        brand_id = payload.brand_id
        if brand_id and not brand_name:
            b_row = conn.execute(text("SELECT name FROM brands WHERE id = :id"), {"id": brand_id}).fetchone()
            if b_row:
                brand_name = b_row[0]

        category_name = payload.category_name
        category_id = payload.category_id
        if category_id and not category_name:
            c_row = conn.execute(text("SELECT name, brand_id FROM categories WHERE id = :id"), {"id": category_id}).fetchone()
            if c_row:
                category_name = c_row[0]
                if not brand_id and c_row[1]:
                    brand_id = c_row[1]

        # Determine primary image URL
        primary_image = payload.image_url or ""
        normalized_images: list[dict] = []
        for idx, img in enumerate(payload.images):
            if isinstance(img, str):
                url_str = img.strip()
                if url_str:
                    is_p = (idx == 0 and not primary_image) or (url_str == primary_image)
                    normalized_images.append({"url": url_str, "is_primary": is_p, "display_order": idx + 1})
            elif isinstance(img, dict):
                url_str = img.get("url", "").strip()
                if url_str:
                    normalized_images.append({
                        "url": url_str,
                        "is_primary": bool(img.get("is_primary")),
                        "display_order": int(img.get("display_order") or idx + 1),
                    })
            elif isinstance(img, ProductImageItem):
                url_str = img.url.strip()
                if url_str:
                    normalized_images.append({
                        "url": url_str,
                        "is_primary": img.is_primary,
                        "display_order": img.display_order or idx + 1,
                    })

        if not primary_image and normalized_images:
            primary_image = normalized_images[0]["url"]
            normalized_images[0]["is_primary"] = True

        result = conn.execute(
            text(
                """
                INSERT INTO products (
                    model_no, name, brand_id, brand, category_id, category_name,
                    description, tags, image_url, brochure_url, is_featured
                )
                VALUES (
                    :model_no, :name, :brand_id, :brand, :category_id, :category_name,
                    :description, :tags, :image_url, :brochure_url, :is_featured
                )
                """
            ),
            {
                "model_no": model_no,
                "name": name,
                "brand_id": brand_id,
                "brand": brand_name or "Maxsel",
                "category_id": category_id,
                "category_name": category_name or "General",
                "description": payload.description or "",
                "tags": payload.tags or "",
                "image_url": primary_image,
                "brochure_url": payload.brochure_url or "",
                "is_featured": 1 if payload.is_featured else 0,
            },
        )
        product_id = result.lastrowid

        # Insert images
        for im in normalized_images:
            conn.execute(
                text(
                    """
                    INSERT INTO product_images (product_id, image_url, is_primary, display_order)
                    VALUES (:pid, :url, :is_p, :ord)
                    """
                ),
                {
                    "pid": product_id,
                    "url": im["url"],
                    "is_p": 1 if im["is_primary"] else 0,
                    "ord": im["display_order"],
                },
            )

        # Insert specifications
        for idx, spec in enumerate(payload.specifications, start=1):
            if isinstance(spec, dict):
                k = (spec.get("key") or spec.get("spec_key") or "").strip()
                v = (spec.get("value") or spec.get("spec_value") or "").strip()
            elif isinstance(spec, ProductSpecItem):
                k = spec.key.strip()
                v = spec.value.strip()
            else:
                k, v = "", ""

            if k and v:
                conn.execute(
                    text(
                        """
                        INSERT INTO product_specifications (product_id, spec_key, spec_value, display_order)
                        VALUES (:pid, :key, :val, :ord)
                        """
                    ),
                    {"pid": product_id, "key": k, "val": v, "ord": idx},
                )

    return {"success": True, "product_id": product_id, "model_no": model_no}


@router.get("/products/{product_id}")
def get_admin_product_by_id(product_id: int, _admin: dict = Depends(get_current_admin)):
    init_db()
    engine = get_engine()
    with engine.connect() as conn:
        row = conn.execute(
            text(
                """
                SELECT p.id, p.model_no, p.name, p.brand_id, p.brand, p.category_id, p.category_name,
                       p.description, p.tags, p.image_url, p.brochure_url, p.is_featured, p.created_at
                FROM products p
                WHERE p.id = :id
                """
            ),
            {"id": product_id},
        ).mappings().fetchone()

        if not row:
            raise HTTPException(status_code=404, detail="Product not found")

        products = attach_product_details(conn, [dict(row)])
        return {"success": True, "product": products[0]}


@router.put("/products/{product_id}")
def update_product(product_id: int, payload: ProductUpdate, _admin: dict = Depends(get_current_admin)):
    init_db()
    engine = get_engine()
    with engine.begin() as conn:
        existing = conn.execute(
            text("SELECT id FROM products WHERE id = :id"), {"id": product_id}
        ).fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Product not found")

        model_no = payload.model_no.strip() if payload.model_no else ""
        if model_no:
            dup = conn.execute(
                text("SELECT id FROM products WHERE model_no = :model_no AND id != :id"),
                {"model_no": model_no, "id": product_id},
            ).fetchone()
            if dup:
                raise HTTPException(
                    status_code=400, detail=f"Product with model number '{model_no}' already exists"
                )

        brand_name = payload.brand
        brand_id = payload.brand_id
        if brand_id and not brand_name:
            b_row = conn.execute(text("SELECT name FROM brands WHERE id = :id"), {"id": brand_id}).fetchone()
            if b_row:
                brand_name = b_row[0]

        category_name = payload.category_name
        category_id = payload.category_id
        if category_id and not category_name:
            c_row = conn.execute(text("SELECT name, brand_id FROM categories WHERE id = :id"), {"id": category_id}).fetchone()
            if c_row:
                category_name = c_row[0]
                if not brand_id and c_row[1]:
                    brand_id = c_row[1]

        primary_image = payload.image_url or ""
        normalized_images: list[dict] = []
        for idx, img in enumerate(payload.images):
            if isinstance(img, str):
                url_str = img.strip()
                if url_str:
                    is_p = (idx == 0 and not primary_image) or (url_str == primary_image)
                    normalized_images.append({"url": url_str, "is_primary": is_p, "display_order": idx + 1})
            elif isinstance(img, dict):
                url_str = img.get("url", "").strip()
                if url_str:
                    normalized_images.append({
                        "url": url_str,
                        "is_primary": bool(img.get("is_primary")),
                        "display_order": int(img.get("display_order") or idx + 1),
                    })
            elif isinstance(img, ProductImageItem):
                url_str = img.url.strip()
                if url_str:
                    normalized_images.append({
                        "url": url_str,
                        "is_primary": img.is_primary,
                        "display_order": img.display_order or idx + 1,
                    })

        if not primary_image and normalized_images:
            primary_image = normalized_images[0]["url"]
            normalized_images[0]["is_primary"] = True

        name = (payload.name or model_no).strip()

        conn.execute(
            text(
                """
                UPDATE products
                SET model_no = :model_no,
                    name = :name,
                    brand_id = :brand_id,
                    brand = :brand,
                    category_id = :category_id,
                    category_name = :category_name,
                    description = :description,
                    tags = :tags,
                    image_url = :image_url,
                    brochure_url = :brochure_url,
                    is_featured = :is_featured
                WHERE id = :id
                """
            ),
            {
                "id": product_id,
                "model_no": model_no,
                "name": name,
                "brand_id": brand_id,
                "brand": brand_name or "Maxsel",
                "category_id": category_id,
                "category_name": category_name or "General",
                "description": payload.description or "",
                "tags": payload.tags or "",
                "image_url": primary_image,
                "brochure_url": payload.brochure_url or "",
                "is_featured": 1 if payload.is_featured else 0,
            },
        )

        # Replace images
        conn.execute(text("DELETE FROM product_images WHERE product_id = :pid"), {"pid": product_id})
        for im in normalized_images:
            conn.execute(
                text(
                    """
                    INSERT INTO product_images (product_id, image_url, is_primary, display_order)
                    VALUES (:pid, :url, :is_p, :ord)
                    """
                ),
                {
                    "pid": product_id,
                    "url": im["url"],
                    "is_p": 1 if im["is_primary"] else 0,
                    "ord": im["display_order"],
                },
            )

        # Replace specifications
        conn.execute(text("DELETE FROM product_specifications WHERE product_id = :pid"), {"pid": product_id})
        for idx, spec in enumerate(payload.specifications, start=1):
            if isinstance(spec, dict):
                k = (spec.get("key") or spec.get("spec_key") or "").strip()
                v = (spec.get("value") or spec.get("spec_value") or "").strip()
            elif isinstance(spec, ProductSpecItem):
                k = spec.key.strip()
                v = spec.value.strip()
            else:
                k, v = "", ""

            if k and v:
                conn.execute(
                    text(
                        """
                        INSERT INTO product_specifications (product_id, spec_key, spec_value, display_order)
                        VALUES (:pid, :key, :val, :ord)
                        """
                    ),
                    {"pid": product_id, "key": k, "val": v, "ord": idx},
                )

    return {"success": True, "message": "Product updated successfully"}


@router.post("/products/batch")
def create_products_batch(payload: BatchProductCreate, _admin: dict = Depends(get_current_admin)):
    init_db()
    if not payload.products:
        raise HTTPException(status_code=400, detail="No products provided")

    created_ids = []
    for item in payload.products:
        # Inherit batch brand and category if missing
        if not item.brand_id:
            item.brand_id = payload.brand_id
        if not item.brand and payload.brand:
            item.brand = payload.brand
        if not item.category_id:
            item.category_id = payload.category_id
        if not item.category_name and payload.category_name:
            item.category_name = payload.category_name

        res = create_product(item, _admin=_admin)
        created_ids.append(res["product_id"])

    return {"success": True, "created_count": len(created_ids), "product_ids": created_ids}


@router.delete("/products/{product_id}")
def delete_product(product_id: int, _admin: dict = Depends(get_current_admin)):
    init_db()
    engine = get_engine()
    with engine.begin() as conn:
        prod = conn.execute(text("SELECT id, name FROM products WHERE id = :id"), {"id": product_id}).fetchone()
        if not prod:
            raise HTTPException(status_code=404, detail="Product not found")

        conn.execute(text("DELETE FROM products WHERE id = :id"), {"id": product_id})
    return {"success": True, "message": f"Product {prod[1]} deleted"}

