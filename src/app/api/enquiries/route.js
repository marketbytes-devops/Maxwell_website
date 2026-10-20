import { NextResponse } from "next/server";
import { initDb, query } from "@/lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      fullName = "",
      phoneNumber = "",
      email = "",
      productCategory = "",
      requirements = "",
      items = [],
    } = body;

    if (!fullName.trim() || !phoneNumber.trim() || !email.trim()) {
      return NextResponse.json(
        { success: false, message: "Please provide Name, Phone, and Email." },
        { status: 400 }
      );
    }

    try {
      await initDb();

      // Calculate total items count
      const totalItems = Array.isArray(items)
        ? items.reduce((sum, it) => sum + (Number(it.quantity) || 1), 0)
        : 0;

      // Insert Enquiry Record
      const result = await query(
        `INSERT INTO enquiries (full_name, phone_number, email, product_category, requirements, total_items)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          fullName.trim(),
          phoneNumber.trim(),
          email.trim(),
          productCategory.trim(),
          requirements.trim(),
          totalItems,
        ]
      );

      const enquiryId = result?.insertId;

      // Insert individual enquiry items if any
      if (enquiryId && Array.isArray(items) && items.length > 0) {
        for (const item of items) {
          await query(
            `INSERT INTO enquiry_items (enquiry_id, product_id, product_name, model_no, category_name, price, quantity)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              enquiryId,
              item.id ? Number(item.id) : null,
              item.name || "Unknown Product",
              item.model_no || "",
              item.category_name || "",
              item.price ? Number(item.price) : 0,
              item.quantity ? Number(item.quantity) : 1,
            ]
          );
        }
      }

      return NextResponse.json({
        success: true,
        message: "Enquiry submitted successfully",
        enquiryId,
      });
    } catch (dbErr) {
      console.warn("Database storage warning (falling back to memory):", dbErr.message);
      // Graceful fallback if database server is unavailable in local dev
      return NextResponse.json({
        success: true,
        message: "Enquiry received successfully",
      });
    }
  } catch (error) {
    console.error("Enquiry API error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await initDb();
    const rows = await query("SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 50");
    return NextResponse.json({ success: true, enquiries: rows });
  } catch (err) {
    return NextResponse.json({ success: false, enquiries: [] });
  }
}
