import Link from '../../../node_modules/next/link';

export default function BookCard(props: {title: any, author: any, id: number}) {

    return (
    <div className="flex border rounded-md border-black flex-col p-3 m-4 items-center justify-center">
        <span className="text-center font-bold">{props.title}</span>
        {props.author ? <span className="text-center">by {props.author}</span> : null}
        <Link href={`/?showDialog=y&search=${props.id}`} className="underline text-center">
        View Book Details
      </Link>
    </div>
  );
}