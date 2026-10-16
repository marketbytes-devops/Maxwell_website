import { NextResponse } from "next/server";
import { initDb, query, getDbPool } from "@/lib/db";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let sql = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (category) {
      sql += " AND category_name = ?";
      params.push(category);
    }

    if (search) {
      sql += " AND (model_no LIKE ? OR name LIKE ? OR tags LIKE ?)";
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern);
    }

    sql += " ORDER BY id DESC";

    const products = await query(sql, params);

    for (const prod of products) {
      const specs = await query(
        "SELECT id, spec_key, spec_value FROM product_specifications WHERE product_id = ? ORDER BY display_order ASC",
        [prod.id]
      );
      prod.specifications = specs;
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Fetch Products Error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("maxsel_admin_session");
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initDb();
    const body = await request.json();
    const {
      model_no,
      name,
      brand,
      category_name,
      tags,
      image_url,
      brochure_url,
      is_featured,
      specifications = [],
    } = body;

    const finalModelNo = model_no?.trim() || `PROD-${Date.now().toString().slice(-6)}`;
    const finalName = (name || finalModelNo).trim();

    // Check if model number already exists
    if (model_no?.trim()) {
      const [existing] = await query("SELECT id FROM products WHERE model_no = ?", [finalModelNo]);
      if (existing) {
        return NextResponse.json(
          { error: `Product with model "${finalModelNo}" already exists.` },
          { status: 400 }
        );
      }
    }

    const pool = getDbPool();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [insertResult] = await connection.execute(
        `INSERT INTO products (model_no, name, brand, category_name, tags, image_url, brochure_url, is_featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          finalModelNo,
          finalName,
          brand?.trim() || "Maxsel",
          category_name?.trim() || "General",
          tags?.trim() || "",
          image_url?.trim() || "",
          brochure_url?.trim() || "",
          is_featured ? 1 : 0,
        ]
      );

      const productId = insertResult.insertId;

      // Insert specifications
      if (Array.isArray(specifications) && specifications.length > 0) {
        let order = 1;
        for (const spec of specifications) {
          if (spec.key?.trim() && spec.value?.trim()) {
            await connection.execute(
              `INSERT INTO product_specifications (product_id, spec_key, spec_value, display_order)
               VALUES (?, ?, ?, ?)`,
              [productId, spec.key.trim(), spec.value.trim(), order++]
            );
          }
        }
      }

      await connection.commit();

      return NextResponse.json({
        success: true,
        productId,
        message: "Product created successfully",
      });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Create Product Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
