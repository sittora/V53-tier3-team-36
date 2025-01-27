import { auth } from "@/auth/auth";
import connectDb from "@/lib/mongodb/mongodb";
import { BookModel } from "@/lib/schemas/book.schema";
import { UserModel } from "@/lib/schemas/user.schema";
import {
  markReadValidator,
  undoMarkReadValidator,
} from "@/lib/validators/mark-read-validator";

import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { upsertBookRead } from "../helpers/upsert-book-read";

// Marking as read
export const POST = auth(async function POST(req) {
  if (!req.auth || !req.auth.user)
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  const requestBody = await req.json();
  try {
    // Validate the request body.
    markReadValidator.parse(requestBody);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
  const { olid, date } = requestBody;

  try {
    await connectDb();

    // update the user's read list
    const user = await UserModel.findById(req.auth.user.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    user.read = Array.from(new Set(user.read.concat(olid)));

    await upsertBookRead(olid, date, req.auth.user.id as string);
    await user.save();

    return NextResponse.json({
      message: `Success: title with olid: ${olid} was added to read list`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to mark book as read" },
      { status: 500 }
    );
  }
});

// This handles undoing the marked as read action
export const PATCH = auth(async function PATCH(req) {
  if (!req.auth || !req.auth.user)
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });

  const requestBody = await req.json();
  try {
    // Validate the request body. If it throws, return a 400 response
    undoMarkReadValidator.parse(requestBody);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
  const { olid } = requestBody;

  try {
    await connectDb();

    // update the user's read list
    const user = await UserModel.findById(req.auth.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { read } = user;
    const filteredList = read.filter((item) => item !== olid);

    user.read = filteredList;

    // Remove the user's id from the book's readBy object
    const targetBook = await BookModel.findOne({ olid });

    if (!targetBook) {
      return NextResponse.json(
        { error: "Book not found in database" },
        { status: 404 }
      );
    }

    targetBook.readBy.delete(req.auth.user.id as string);

    await targetBook.save();
    await user.save();

    return NextResponse.json({
      message: `Success: title with olid: ${olid} was removed from read list`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to unmark book as read" },
      { status: 500 }
    );
  }
});
