"""
Script to export local Brands, Categories, and Products to export_catalog.sql
Run this script on your local machine:
    python export_catalog.py
"""

import os
import pymysql

# Read connection details from .env.local or fallback to defaults
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = os.getenv("DB_PASSWORD", "Akshay@2002")
DB_NAME = "maxsel_db"
DB_PORT = 3306

def escape_val(v):
    if v is None:
        return "NULL"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, bool):
        return "1" if v else "0"
    # String or bytes
    s = str(v).replace("\\", "\\\\").replace("'", "\\'")
    return f"'{s}'"

def export():
    print(f"Connecting to local MySQL ({DB_HOST}:{DB_PORT}/{DB_NAME})...")
    conn = pymysql.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=DB_PORT,
        charset="utf8mb4",
    )

    tables = [
        "brands",
        "categories",
        "products",
        "product_categories",
        "product_images",
        "product_specs",
    ]

    sql_lines = [
        "-- Maxwell Catalog Export",
        "SET FOREIGN_KEY_CHECKS = 0;",
        "SET NAMES utf8mb4;",
        "",
    ]

    counts = {}

    with conn.cursor() as cur:
        for table in tables:
            # Check if table exists
            cur.execute(f"SHOW TABLES LIKE '{table}'")
            if not cur.fetchone():
                continue

            cur.execute(f"SELECT * FROM `{table}`")
            rows = cur.fetchall()
            counts[table] = len(rows)

            if not rows:
                continue

            # Column names
            cur.execute(f"DESCRIBE `{table}`")
            cols = [f"`{col[0]}`" for col in cur.fetchall()]
            cols_str = ", ".join(cols)

            sql_lines.append(f"-- Table: {table} ({len(rows)} rows)")
            for row in rows:
                vals = ", ".join(escape_val(v) for v in row)
                sql_lines.append(f"REPLACE INTO `{table}` ({cols_str}) VALUES ({vals});")
            sql_lines.append("")

    sql_lines.append("SET FOREIGN_KEY_CHECKS = 1;")
    sql_lines.append("-- Export completed successfully.")

    out_file = "export_catalog.sql"
    with open(out_file, "w", encoding="utf-8") as f:
        f.write("\n".join(sql_lines))

    conn.close()

    print("\n Export completed successfully!")
    print(f"Output file: {os.path.abspath(out_file)}")
    print("Summary of exported data:")
    for t, c in counts.items():
        print(f"  - {t}: {c} rows")

if __name__ == "__main__":
    try:
        export()
    except Exception as e:
        print(f"Error during export: {e}")
