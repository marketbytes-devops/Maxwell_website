import re
import threading
from urllib.parse import quote_plus

import pymysql
from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine

from app.config import ADMIN_EMAIL, ADMIN_PASSWORD, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER

DEFAULT_13_CATEGORIES = [
    {"name": "Visi Cooler", "capacity_note": "Capacity: 30 Liters - 1500 Liters", "is_new": False},
    {"name": "Deep Freezer", "capacity_note": "Capacity: 70 Liters to 720 Liters", "is_new": False},
    {"name": "Stainless Steel Upright Products", "capacity_note": "Capacity: 600 Liters to 1800 Liters", "is_new": False},
    {"name": "Stainless Steel Under Counters", "capacity_note": "Length: 700 mm to 1800 mm", "is_new": False},
    {"name": "Medical Refrigeration", "capacity_note": "Capacity: 140 Liters to 500 Liters", "is_new": True},
    {"name": "Storage Water Cooler", "capacity_note": "Capacity: 80 to 120 Liters", "is_new": True},
    {"name": "Vertical Freezer", "capacity_note": "Capacity: 300 Liters to 950 Liters", "is_new": False},
    {"name": "Ice Machines", "capacity_note": "Capacity: 27 Kgs to 900 kgs", "is_new": False},
    {"name": "Pastry Cabinet", "capacity_note": "Length: 2 - 5 ft.", "is_new": False},
    {"name": "Back Bar", "capacity_note": "Capacity: 226 Liters to 349 Liters", "is_new": False},
    {"name": "Supermarket Range", "capacity_note": "Capacity: 935 to 1435 Liters", "is_new": False},
    {"name": "Dishwasher", "capacity_note": "Capacity: 33 to 69 Basket per hour", "is_new": True},
    {"name": "Preparation Table", "capacity_note": "Capacity: 272 Liters to 1000 Liters", "is_new": False},
]

DEFAULT_BRANDS = ["Western", "Hoshizaki", "Butler", "Maxsel", "Rational", "Unox"]

_engine: Engine | None = None
_init_lock = threading.Lock()
_is_initialized = False


def slugify(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.strip().lower()).strip("-")
    return slug or "item"


def get_engine() -> Engine:
    global _engine
    if _engine is None:
        encoded_user = quote_plus(DB_USER)
        encoded_pass = quote_plus(DB_PASSWORD)
        url = f"mysql+pymysql://{encoded_user}:{encoded_pass}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4"
        _engine = create_engine(
            url,
            pool_pre_ping=True,
            pool_recycle=1800,
            pool_size=10,
            max_overflow=20,
        )
    return _engine


def _ensure_database_exists() -> None:
    conn = pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        charset="utf8mb4",
        autocommit=True,
    )
    try:
        with conn.cursor() as cur:
            safe_db = DB_NAME.replace("`", "")
            cur.execute(
                f"CREATE DATABASE IF NOT EXISTS `{safe_db}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
            )
    finally:
        conn.close()


def _column_exists(conn, table_name: str, column_name: str) -> bool:
    row = conn.execute(
        text(
            """
            SELECT COUNT(*) AS cnt
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = :db_name
              AND TABLE_NAME = :table_name
              AND COLUMN_NAME = :column_name
            """
        ),
        {"db_name": DB_NAME, "table_name": table_name, "column_name": column_name},
    ).fetchone()
    return bool(row and row[0] > 0)


def _drop_global_unique_indexes_on_categories(conn) -> None:
    rows = conn.execute(
        text(
            """
            SELECT DISTINCT INDEX_NAME
            FROM INFORMATION_SCHEMA.STATISTICS
            WHERE TABLE_SCHEMA = :db_name
              AND TABLE_NAME = 'categories'
              AND NON_UNIQUE = 0
              AND INDEX_NAME != 'PRIMARY'
              AND COLUMN_NAME IN ('name', 'slug')
            """
        ),
        {"db_name": DB_NAME},
    ).fetchall()
    for (index_name,) in rows:
        safe_idx = str(index_name).replace("`", "")
        conn.execute(text(f"ALTER TABLE categories DROP INDEX `{safe_idx}`"))


def _drop_global_unique_indexes_on_products(conn) -> None:
    try:
        rows = conn.execute(
            text(
                """
                SELECT DISTINCT INDEX_NAME
                FROM INFORMATION_SCHEMA.STATISTICS
                WHERE TABLE_SCHEMA = :db_name
                  AND TABLE_NAME = 'products'
                  AND NON_UNIQUE = 0
                  AND INDEX_NAME != 'PRIMARY'
                  AND COLUMN_NAME = 'model_no'
                """
            ),
            {"db_name": DB_NAME},
        ).fetchall()
        for (index_name,) in rows:
            safe_idx = str(index_name).replace("`", "")
            conn.execute(text(f"ALTER TABLE products DROP INDEX `{safe_idx}`"))
    except Exception as e:
        print(f"Warning dropping unique index on products: {e}")


def seed_default_categories_for_brand(conn, brand_id: int) -> int:
    inserted = 0
    for idx, cat in enumerate(DEFAULT_13_CATEGORIES, start=1):
        cat_slug = slugify(cat["name"])
        existing = conn.execute(
            text(
                """
                SELECT id FROM categories
                WHERE brand_id = :brand_id AND parent_id IS NULL AND (slug = :slug OR name = :name)
                LIMIT 1
                """
            ),
            {"brand_id": brand_id, "slug": cat_slug, "name": cat["name"]},
        ).fetchone()
        if not existing:
            conn.execute(
                text(
                    """
                    INSERT INTO categories (brand_id, parent_id, name, slug, level, capacity_note, is_new, sort_order)
                    VALUES (:brand_id, NULL, :name, :slug, 1, :capacity_note, :is_new, :sort_order)
                    """
                ),
                {
                    "brand_id": brand_id,
                    "name": cat["name"],
                    "slug": cat_slug,
                    "capacity_note": cat["capacity_note"],
                    "is_new": 1 if cat["is_new"] else 0,
                    "sort_order": idx,
                },
            )
            inserted += 1
    return inserted


def init_db(force: bool = False) -> None:
    global _is_initialized
    if _is_initialized and not force:
        return

    with _init_lock:
        if _is_initialized and not force:
            return

        _ensure_database_exists()
        engine = get_engine()

        with engine.begin() as conn:
            conn.execute(
                text(
                    """
                    CREATE TABLE IF NOT EXISTS admins (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        email VARCHAR(255) NOT NULL UNIQUE,
                        password VARCHAR(255) NOT NULL,
                        name VARCHAR(100) DEFAULT 'Admin',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                    """
                )
            )

            conn.execute(
                text(
                    """
                    CREATE TABLE IF NOT EXISTS brands (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        name VARCHAR(255) NOT NULL UNIQUE,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                    """
                )
            )

            conn.execute(
                text(
                    """
                    CREATE TABLE IF NOT EXISTS categories (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        brand_id INT NULL,
                        parent_id INT NULL,
                        name VARCHAR(255) NOT NULL,
                        slug VARCHAR(255) NOT NULL,
                        level TINYINT NOT NULL DEFAULT 1,
                        capacity_note VARCHAR(255) DEFAULT '',
                        is_new BOOLEAN DEFAULT FALSE,
                        sort_order INT DEFAULT 0,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        INDEX idx_categories_brand (brand_id),
                        INDEX idx_categories_parent (parent_id),
                        CONSTRAINT fk_categories_brand FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
                        CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                    """
                )
            )

            # Migrate legacy categories table if created before brand_id/parent_id existed
            if not _column_exists(conn, "categories", "brand_id"):
                conn.execute(text("ALTER TABLE categories ADD COLUMN brand_id INT NULL AFTER id"))
                conn.execute(text("ALTER TABLE categories ADD INDEX idx_categories_brand (brand_id)"))
            if not _column_exists(conn, "categories", "parent_id"):
                conn.execute(text("ALTER TABLE categories ADD COLUMN parent_id INT NULL AFTER brand_id"))
                conn.execute(text("ALTER TABLE categories ADD INDEX idx_categories_parent (parent_id)"))
            if not _column_exists(conn, "categories", "level"):
                conn.execute(text("ALTER TABLE categories ADD COLUMN level TINYINT NOT NULL DEFAULT 1 AFTER slug"))
            if not _column_exists(conn, "categories", "sort_order"):
                conn.execute(text("ALTER TABLE categories ADD COLUMN sort_order INT DEFAULT 0 AFTER is_new"))
            _drop_global_unique_indexes_on_categories(conn)

            conn.execute(
                text(
                    """
                    CREATE TABLE IF NOT EXISTS products (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        model_no VARCHAR(100) NOT NULL,
                        name VARCHAR(255) NOT NULL,
                        brand_id INT DEFAULT NULL,
                        brand VARCHAR(100) DEFAULT 'Maxsel',
                        category_id INT DEFAULT NULL,
                        category_name VARCHAR(255) DEFAULT '',
                        description TEXT,
                        tags TEXT,
                        image_url TEXT,
                        brochure_url TEXT,
                        is_featured BOOLEAN DEFAULT FALSE,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                        INDEX idx_products_model_no (model_no),
                        INDEX idx_products_brand_id (brand_id),
                        INDEX idx_products_category_id (category_id)
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                    """
                )
            )

            if not _column_exists(conn, "products", "brand_id"):
                conn.execute(text("ALTER TABLE products ADD COLUMN brand_id INT DEFAULT NULL AFTER name"))
                conn.execute(text("ALTER TABLE products ADD INDEX idx_products_brand_id (brand_id)"))
            if not _column_exists(conn, "products", "description"):
                conn.execute(text("ALTER TABLE products ADD COLUMN description TEXT AFTER category_name"))

            # Migrate existing tables: drop any legacy global unique constraint on model_no
            _drop_global_unique_indexes_on_products(conn)
            try:
                conn.execute(text("ALTER TABLE products ADD INDEX idx_products_model_no (model_no)"))
            except Exception:
                pass

            conn.execute(
                text(
                    """
                    CREATE TABLE IF NOT EXISTS product_images (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        product_id INT NOT NULL,
                        image_url TEXT NOT NULL,
                        is_primary BOOLEAN DEFAULT FALSE,
                        display_order INT DEFAULT 0,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        INDEX idx_product_images_product_id (product_id),
                        CONSTRAINT fk_product_images_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                    """
                )
            )

            conn.execute(
                text(
                    """
                    CREATE TABLE IF NOT EXISTS product_specifications (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        product_id INT NOT NULL,
                        spec_key VARCHAR(150) NOT NULL,
                        spec_value VARCHAR(255) NOT NULL,
                        display_order INT DEFAULT 0,
                        INDEX idx_product_id (product_id),
                        CONSTRAINT fk_product_specs_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                    """
                )
            )

            conn.execute(
                text(
                    """
                    CREATE TABLE IF NOT EXISTS enquiries (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        full_name VARCHAR(255) NOT NULL,
                        phone_number VARCHAR(50) NOT NULL,
                        email VARCHAR(255) NOT NULL,
                        product_category VARCHAR(255) DEFAULT '',
                        requirements TEXT,
                        total_items INT DEFAULT 0,
                        status VARCHAR(50) DEFAULT 'New',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                    """
                )
            )

            conn.execute(
                text(
                    """
                    CREATE TABLE IF NOT EXISTS enquiry_items (
                        id INT AUTO_INCREMENT PRIMARY KEY,
                        enquiry_id INT NOT NULL,
                        product_id INT DEFAULT NULL,
                        product_name VARCHAR(255) NOT NULL,
                        model_no VARCHAR(100) DEFAULT '',
                        category_name VARCHAR(255) DEFAULT '',
                        price DECIMAL(10, 2) DEFAULT 0.00,
                        quantity INT DEFAULT 1,
                        INDEX idx_enquiry_id (enquiry_id),
                        CONSTRAINT fk_enquiry_items_enquiry FOREIGN KEY (enquiry_id) REFERENCES enquiries(id) ON DELETE CASCADE
                    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
                    """
                )
            )

            # Seed default admin
            existing_admin = conn.execute(
                text("SELECT id FROM admins WHERE email = :email"),
                {"email": ADMIN_EMAIL},
            ).fetchone()
            if not existing_admin:
                conn.execute(
                    text("INSERT INTO admins (email, password, name) VALUES (:email, :password, :name)"),
                    {"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD, "name": "Maxsel Superadmin"},
                )

            # Seed default brands if empty
            brand_count = conn.execute(text("SELECT COUNT(*) FROM brands")).scalar() or 0
            if brand_count == 0:
                for brand_name in DEFAULT_BRANDS:
                    conn.execute(text("INSERT INTO brands (name) VALUES (:name)"), {"name": brand_name})

            # Ensure any legacy unbranded categories get attached to the first brand (e.g. Maxsel or first brand)
            first_brand = conn.execute(
                text("SELECT id FROM brands ORDER BY CASE WHEN name = 'Maxsel' THEN 0 ELSE 1 END, id ASC LIMIT 1")
            ).fetchone()
            if first_brand:
                first_brand_id = first_brand[0]
                conn.execute(
                    text("UPDATE categories SET brand_id = :brand_id WHERE brand_id IS NULL"),
                    {"brand_id": first_brand_id},
                )
                # If no categories exist at all, seed the 13 categories for the default brand
                cat_count = conn.execute(text("SELECT COUNT(*) FROM categories")).scalar() or 0
                if cat_count == 0:
                    seed_default_categories_for_brand(conn, first_brand_id)

        _is_initialized = True
