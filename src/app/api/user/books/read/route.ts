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
    return NextResponse.json({ message: "Success" });

  const requestBody = await req.json();
  try {
    // Validate the request body. If it throws, return a 400 response
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
    const { read } = user;
    read.push(olid);
    user.read = Array.from(new Set(read));

    // update or upsert the book collection
    await upsertBookRead(olid, date, req.auth.user.id as string);

    await user.save();
    return NextResponse.json({
      message: `Success: title with olid: ${olid} was added to read list`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to mark book as read" },
      { status: 500 }
    );
  }
});

// Undo the marked as read request via PATCH

export const PATCH = auth(async function PATCH(req) {
  if (!req.auth || !req.auth.user)
    return NextResponse.json({ message: "Success" });

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
  const { olid } = requestBody; // TODO: if the action is something other than mark unread, it needs to be evaluated

  try {
    await connectDb();

    // update the user's read list
    const user = await UserModel.findById(req.auth.user.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { read } = user;
    const filteredList = read.filter((item) => item !== olid);

    user.read = filteredList;

    // Remove the user's id from the book's readBy object
    const targetBook = await BookModel.findOne({ olid });

    if (!targetBook) {
      return NextResponse.json(
        { message: "Book not found in database" },
        { status: 404 }
      );
    }

    const { readBy } = targetBook;
    readBy.delete(req.auth.user.id as string); // Remove the key-value pair of the user

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
