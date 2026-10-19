import { NextResponse } from "next/server";
import { initDb, query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    await initDb();
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Search by ID or model_no
    let products = await query("SELECT * FROM products WHERE id = ? OR model_no = ?", [id, id]);

    if (!products || products.length === 0) {
      // Graceful fallback for demo product F450GL23
      return NextResponse.json({
        success: true,
        product: {
          id: id,
          model_no: "F450GL23",
          name: "F450GL23",
          brand: "Western",
          category_name: "Deep Freezer",
          tags: "Freezers, Glass Top Deep Freezers",
          image_url: "/products/freezer/main_view.png",
          gallery: [
            "/products/freezer/main_view.png",
            "/products/freezer/thumb_1.png",
            "/products/freezer/thumb_2.png",
            "/products/freezer/thumb_3.png",
            "/products/freezer/thumb_4.png",
          ],
          specifications: [
            { spec_key: "External Dimension (mm)", spec_value: "1360 (W) x 695 (D) x 882 (H)" },
            { spec_key: "Gross volume", spec_value: "422 Liters" },
            { spec_key: "Temperature range (°C)", spec_value: "< - 17.0°C" },
            { spec_key: "No. of Baskets", spec_value: "3" },
            { spec_key: "Energy Star Rating", spec_value: "3 Star" },
          ],
        },
      });
    }

    const product = products[0];

    const specs = await query(
      "SELECT id, spec_key, spec_value FROM product_specifications WHERE product_id = ? ORDER BY display_order ASC",
      [product.id]
    );
    product.specifications = specs;

    // Build gallery images
    if (product.model_no === "F450GL23") {
      product.gallery = [
        "/products/freezer/main_view.png",
        "/products/freezer/thumb_1.png",
        "/products/freezer/thumb_2.png",
        "/products/freezer/thumb_3.png",
        "/products/freezer/thumb_4.png",
      ];
    } else {
      product.gallery = [
        product.image_url,
        "/products/freezer/thumb_1.png",
        "/products/freezer/thumb_2.png",
        "/products/freezer/thumb_3.png",
      ];
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Single Product API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}
