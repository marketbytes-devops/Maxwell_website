import { NextResponse } from "next/server";
import { initDb, query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await initDb();
    const categories = await query("SELECT id, name, slug, capacity_note, is_new FROM categories ORDER BY name ASC");
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Categories API Error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();
    const { name } = body;
    if (!name?.trim()) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const trimmedName = name.trim();
    const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // Check if exists
    const [exist] = await query("SELECT id FROM categories WHERE name = ? OR slug = ?", [trimmedName, slug]);
    if (exist) {
      return NextResponse.json({ error: `Category "${trimmedName}" already exists` }, { status: 400 });
    }

    const result = await query(
      "INSERT INTO categories (name, slug, capacity_note, is_new) VALUES (?, ?, '', 0)",
      [trimmedName, slug]
    );

    return NextResponse.json({
      success: true,
      category: { id: result.insertId, name: trimmedName, slug },
    });
  } catch (error) {
    console.error("Create Category Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 });
  }
}

