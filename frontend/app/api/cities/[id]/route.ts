import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import City from "@/models/City";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // Await params for Next.js 15
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    const deleted = await City.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json({ error: "City not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}