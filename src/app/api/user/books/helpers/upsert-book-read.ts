import { BookModel } from "@/lib/schemas/book.schema";

/**
 * This will find a book by its open library id and user id and update the document
 * If the book does not exist, it will be created
 * @param olid Open library id
 * @param date Date read
 * @param userId mongo id of the user
 */
export async function upsertBookRead(olid: string, date: Date, userId: string) {
  const targetBook = await BookModel.findOne({
    olid,
  });
  if (!targetBook) {
    await BookModel.create({
      olid,
      readBy: { [userId]: date },
    });
  } else {
    const { readBy } = targetBook;
    readBy.set(userId, date);

    await targetBook.save();
  }
}
