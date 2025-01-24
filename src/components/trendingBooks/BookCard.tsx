export default function BookCard(props: {title: any, author: any}) {
  return (
    <div className="flex border rounded-md border-black flex-col p-3 m-4 items-center justify-center">
        <span className="text-center font-bold">{props.title}</span>
        <span className="text-center">by {props.author}</span>
    </div>
  );
}