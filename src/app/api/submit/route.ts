import { NextRequest, NextResponse } from "next/server";
import { addProfile } from "@/lib/sheets";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, major, gradYear, website, building, photoUrl, linkedin, github, twitter } = body;

    if (!name?.trim() || !major?.trim() || !gradYear?.trim() || !building?.trim()) {
      return NextResponse.json(
        { error: "Name, major, class year, and building description are required." },
        { status: 400 }
      );
    }

    await addProfile({ name, major, gradYear, website, building, photoUrl, linkedin, github, twitter });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
