import { connectToDatabase } from "@/lib/db";
import User from "@/models/user";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

//POST /api/auth/register
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }
    //check for existing user
    await connectToDatabase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    //if reached this point means a new user is here
    const userData = await User.create({ email, password });

    return NextResponse.json(
      { message: "User registered successfully", userId: userData },
      { status: 201 }
    );
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "FAILED" }, { status: 500 });
  }
}
