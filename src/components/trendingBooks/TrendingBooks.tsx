import BookCard from "./BookCard";

const TRENDING_URL = "http://openlibrary.org/trending/daily.json?page=1";

export default async function TrendingBooks() {
  const trendingData = await fetch(TRENDING_URL);
  const trendingBooks = await trendingData.json();
  const {works} = trendingBooks;

  const booksToShow = works.slice(0, 20).map((bookSingle: any) => {
    const {key, author_name, cover_i, edition_count, first_publish_year, title} = bookSingle;

    return {
        id: key,
        author: author_name,
        cover_id: cover_i,
        edition_count: edition_count,
        first_publish_year: first_publish_year,
        title: title
    }
});

  return (
    <div>
        <span className="font-bold text-3xl">Trending Books</span>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {booksToShow.map((book: any) => {
                return (
                    <BookCard title={book.title} author={book.author} id={book.id} />
                )
            })}
        </div>
    </div>
  );
}