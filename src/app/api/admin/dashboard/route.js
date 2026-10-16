import { NextResponse } from "next/server";
import { initDb, query } from "@/lib/db";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("maxsel_admin_session");
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initDb();

    // 1. Total products count
    const [productsCountRow] = await query("SELECT COUNT(*) as total FROM products");
    const totalProducts = productsCountRow?.total || 0;

    // 2. Total categories count
    const [categoriesCountRow] = await query("SELECT COUNT(*) as total FROM categories");
    const totalCategories = categoriesCountRow?.total || 0;

    // 3. Featured products count
    const [featuredCountRow] = await query("SELECT COUNT(*) as total FROM products WHERE is_featured = 1");
    const featuredProducts = featuredCountRow?.total || 0;

    // 4. Categories list with product count
    const categoriesWithCount = await query(`
      SELECT 
        c.id, 
        c.name, 
        c.slug, 
        c.capacity_note, 
        c.is_new,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON c.name = p.category_name
      GROUP BY c.id, c.name, c.slug, c.capacity_note, c.is_new
      ORDER BY product_count DESC, c.name ASC
    `);

    // 5. Recent products with their specs
    const recentProducts = await query(`
      SELECT 
        id, 
        model_no, 
        name, 
        brand, 
        category_name, 
        tags, 
        image_url, 
        brochure_url, 
        is_featured, 
        created_at
      FROM products
      ORDER BY id DESC
      LIMIT 10
    `);

    // Fetch specifications for these recent products
    for (const prod of recentProducts) {
      const specs = await query(
        "SELECT spec_key, spec_value FROM product_specifications WHERE product_id = ? ORDER BY display_order ASC",
        [prod.id]
      );
      prod.specifications = specs;
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalProducts,
        totalCategories,
        featuredProducts,
      },
      categories: categoriesWithCount,
      recentProducts,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 });
  }
}
