import { auth } from "@/auth/auth";
import connectDb from "@/lib/mongodb/mongodb";
import { BookModel } from "@/lib/schemas/book.schema";
import { UserModel } from "@/lib/schemas/user.schema";

import { undoMarkWantToReadValidator } from "@/lib/validators/mark-want-to-read-validator";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { upsertBookWantToRead } from "../helpers/upsert-book-want-to-read";

export const POST = auth(async function POST(req) {
  if (!req.auth || !req.auth.user)
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  const requestBody = await req.json();
  const { olid } = requestBody;

  if (!olid)
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 400 }
    );
  try {
    // Add the book to the user's want-to-read list if it's not there already
    // Add the book to the book collection (if it doesn't exist)
    const user = await UserModel.findById(req.auth.user.id);
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const { wantToRead } = user;

    wantToRead.push(olid);
    user.wantToRead = Array.from(new Set(wantToRead));
    await upsertBookWantToRead(olid, req.auth.user.id as string);

    await user.save();
    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to mark book as want to read" },
      { status: 500 }
    );
  }
});

// Remove a book from the user's want-to-read list (undo) and update the book collection
export const PATCH = auth(async function PATCH(req) {
  if (!req.auth || !req.auth.user)
    return NextResponse.json({ message: "Not authorized" }, { status: 401 });

  const requestBody = await req.json();

  try {
    undoMarkWantToReadValidator.parse(requestBody);
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
    const user = await UserModel.findById(req.auth.user.id);
    if (!user)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    const userWantToReadList = user.wantToRead;

    // Remove the book from the user's want-to-read list
    const filteredList = userWantToReadList.filter((book) => book !== olid);
    user.wantToRead = filteredList;

    // Update the book by searching for it by olid and removing the user's id from the wantToRead array
    const targetBook = await BookModel.findOne({ olid });
    if (!targetBook)
      return NextResponse.json({ message: "Book not found" }, { status: 404 });

    targetBook.wantToRead = targetBook.wantToRead.filter(
      (userId) => userId !== req.auth!.user!.id
    );

    await user.save();
    await targetBook.save();
    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to mark book as unread" },
      { status: 500 }
    );
  }
});
