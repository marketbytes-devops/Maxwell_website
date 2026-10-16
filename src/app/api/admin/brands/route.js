import { NextResponse } from "next/server";
import { initDb, query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await initDb();
    const brands = await query("SELECT id, name, created_at FROM brands ORDER BY name ASC");
    return NextResponse.json({ success: true, brands });
  } catch (error) {
    console.error("Brands API Error:", error);
    return NextResponse.json({ error: "Failed to fetch brands" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await initDb();
    const body = await request.json();
    const { name } = body;
    if (!name?.trim()) {
      return NextResponse.json({ error: "Brand name is required" }, { status: 400 });
    }

    const trimmedName = name.trim();
    const [exist] = await query("SELECT id FROM brands WHERE name = ?", [trimmedName]);
    if (exist) {
      return NextResponse.json({ error: `Brand "${trimmedName}" already exists` }, { status: 400 });
    }

    const result = await query("INSERT INTO brands (name) VALUES (?)", [trimmedName]);

    return NextResponse.json({
      success: true,
      brand: { id: result.insertId, name: trimmedName },
    });
  } catch (error) {
    console.error("Create Brand Error:", error);
    return NextResponse.json({ error: error.message || "Failed to create brand" }, { status: 500 });
  }
}
