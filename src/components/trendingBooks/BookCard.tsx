import NextImg from "next/image";
import Link from "next/link";
export default function BookCard({
  title,
  author,
  id,
  url,
}: {
  title: string;
  author: string;
  id: string;
  url: string;
}) {
  const extractedId = id.split("/")[2];

  return (
    <div
      className="flex border rounded-md border-black flex-col p-3 m-4 items-center justify-center"
      key={id}
    >
      <div>
        {/* image section */}
        <NextImg
          src={`https://covers.openlibrary.org/w/olid/${extractedId}.jpg`}
          alt="book cover"
          height={100}
          width={80}
        />
      </div>
      <span className="text-center font-bold">{title}</span>
      {author ? <span className="text-center">by {author}</span> : null}
      <Link
        href={`${url}showDialog=y&work=${id}`}
        className="underline text-center"
      >
        View Book Details
      </Link>
    </div>
  );
}
