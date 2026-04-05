import Groq from "groq-sdk";
import { NextResponse } from "next/server";

// Initialize Groq with your key
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { weatherData, location } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Groq Key Missing" }, { status: 500 });
    }

    const prompt = `
      Context: Tactical Weather Analysis for ${location}.
      Metrics: ${weatherData.current.temperature_2m}°C, ${weatherData.current.relative_humidity_2m}% humidity, UV Index ${weatherData.current.uv_index}.
      Task: Provide a sharp, 2-sentence briefing. 
      Sentence 1: The current atmospheric feel. 
      Sentence 2: One specific recommendation for clothing or activity.
      Tone: Professional, elite, and concise. Do not use conversational filler.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a specialized weather intelligence officer.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.5, // Keeps responses focused
      max_tokens: 100,  // Keeps it brief
    });

    const insight = chatCompletion.choices[0]?.message?.content || "";

    return NextResponse.json({ insight: insight.trim() });
  } catch (error: any) {
    console.error("GROQ AI ERROR:", error.message);
    return NextResponse.json({ error: "Intelligence failure", details: error.message }, { status: 500 });
  }
}