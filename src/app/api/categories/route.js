import { NextResponse } from "next/server";
import { initDb, query } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await initDb();
    const categories = await query("SELECT id, name, slug, capacity_note, is_new FROM categories ORDER BY name ASC");
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error("Public Categories API Error:", error);
    return NextResponse.json({ success: false, categories: [], error: "Failed to fetch categories" }, { status: 500 });
  }
}
