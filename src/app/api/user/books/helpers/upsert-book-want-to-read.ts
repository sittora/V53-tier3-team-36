import { BookModel } from "@/lib/schemas/book.schema";

export async function upsertBookWantToRead(olid: string, userId: string) {
  // Find the book in the collection, upsert as necessary
  const targetBook = await BookModel.findOne({ olid });

  if (!targetBook) {
    await BookModel.create({ olid: olid, wantToRead: [userId] });
  } else {
    const { wantToRead } = targetBook;
    wantToRead.push(userId);
    targetBook.wantToRead = Array.from(new Set(wantToRead));
    await targetBook.save();
  }
}
