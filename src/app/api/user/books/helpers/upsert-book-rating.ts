import { BookModel } from "@/lib/schemas/book.schema";

export async function upsertBookRating(
  olid: string,
  userId: string,
  rating: number
): Promise<void> {
  // Check if the book exists, if not create it and add the rating and user info to it

  const targetBook = await BookModel.findOne({ olid });
  if (!targetBook) {
    await BookModel.create({
      olid,
      userRatings: { [userId]: rating },
    });
    return;
  }

  targetBook.userRatings.set(userId, rating);
  await targetBook.save();
}
