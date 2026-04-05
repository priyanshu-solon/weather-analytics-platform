import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import City from "@/models/City";

export async function GET() {
  try {
    await dbConnect();
    const cities = await City.find({ userId: "temp-user-123" }).sort({ addedAt: -1 });
    return NextResponse.json({ success: true, data: cities });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, lat, lon } = await req.json();
    const userId = "temp-user-123";

    const existing = await City.findOne({ name, userId });
    if (existing) return NextResponse.json({ error: "Already pinned" }, { status: 400 });

    const newCity = await City.create({ name, lat, lon, userId });
    return NextResponse.json({ success: true, data: newCity }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}