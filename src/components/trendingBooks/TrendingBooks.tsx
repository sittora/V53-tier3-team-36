import { OpenLibrary } from "app/clients/open-library-client";
import BookCard from "./BookCard";

type Book = {
    title: string,
    author_name: string | Array<string>,
    key: number,
    cover_i: string,
    first_publish_year: number,
}

type TrendingWorks = {
    works: Array<Book>
}

export default async function TrendingBooks() {
  const trendingData = await OpenLibrary.getTrendingBooks()
  const {works} = trendingData as TrendingWorks;

  const booksToShow = works.slice(0, 20);

  return (
    <div>
        <span className="font-bold text-3xl">Trending Books</span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {booksToShow.map((book: Book) => {
                const author = Array.isArray(book.author_name) ? book.author_name[0] : book.author_name
                return (
                    <BookCard title={book.title} author={author} id={book.key} />
                )
            })}
        </div>
    </div>
  );
}