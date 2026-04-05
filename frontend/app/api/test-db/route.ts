import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// NO "default" here! Use a named export for the GET method.
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("weather-intel");
    
    // Ping to verify connection
    await db.command({ ping: 1 });
    
    return NextResponse.json({ 
      status: "Online", 
      message: "MongoDB Intel Link Established" 
    });
  } catch (e) {
    console.error("Database connection error:", e);
    return NextResponse.json({ 
      status: "Offline", 
      error: "Connection Failed" 
    }, { status: 500 });
  }
}