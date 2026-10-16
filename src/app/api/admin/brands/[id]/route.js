import { NextResponse } from "next/server";
import { initDb, query } from "@/lib/db";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function PUT(request, { params }) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("maxsel_admin_session");
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initDb();
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Brand name is required" }, { status: 400 });
    }

    const trimmedName = name.trim();
    await query("UPDATE brands SET name = ? WHERE id = ?", [trimmedName, id]);

    return NextResponse.json({ success: true, message: "Brand updated" });
  } catch (error) {
    console.error("Update Brand Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update brand" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("maxsel_admin_session");
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initDb();
    const { id } = await params;

    await query("DELETE FROM brands WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Brand deleted" });
  } catch (error) {
    console.error("Delete Brand Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete brand" }, { status: 500 });
  }
}
