import { NextResponse } from "next/server";
import { initDb, query } from "@/lib/db";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function DELETE(request, { params }) {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("maxsel_admin_session");
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await initDb();
    const { id } = await params;

    await query("DELETE FROM products WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
