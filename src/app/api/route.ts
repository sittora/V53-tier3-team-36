import { UserModel } from "@/lib/models/user.model";
import connectDb from "@/lib/mongodb/mongodb";
import { NextResponse } from "next/server";

// This is placehodler data.
export async function GET() {
  await connectDb(); // This is required before any DB operations.
  const createdUser = await UserModel.create({
    email: "test@email.com",
    name: "Test User",
  });

  return NextResponse.json({ message: "Hello, World!", data: createdUser._id });
}
