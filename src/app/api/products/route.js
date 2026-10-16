import { NextResponse } from "next/server";
import { initDb, query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    await initDb();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let sql = "SELECT * FROM products WHERE 1=1";
    const params = [];

    if (category && category !== "All" && category !== "all") {
      sql += " AND category_name = ?";
      params.push(category);
    }

    if (search && search.trim()) {
      sql += " AND (model_no LIKE ? OR name LIKE ? OR tags LIKE ?)";
      const pattern = `%${search.trim()}%`;
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
    console.error("Public Products API Error:", error);
    return NextResponse.json({ success: false, products: [], error: "Failed to fetch products" }, { status: 500 });
  }
}
