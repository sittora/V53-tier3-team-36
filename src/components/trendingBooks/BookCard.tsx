import Link from 'next/link';

export default function BookCard({ title, author, id} : { title: string, author: string, id: number } ) {

    return (
    <div className="flex border rounded-md border-black flex-col p-3 m-4 items-center justify-center" key={id}>
        <span className="text-center font-bold">{title}</span>
        {author ? <span className="text-center">by {author}</span> : null}
        <Link href={`/?showDialog=y&search=${id}`} className="underline text-center">
        View Book Details
      </Link>
    </div>
  );
}