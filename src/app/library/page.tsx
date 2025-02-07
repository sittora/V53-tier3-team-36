"use client";
import BookCard from "@/components/trendingBooks/BookCard";
import { BookData } from "@/types/open-library";
import { UserClient } from "app/clients/user-client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import { useEffect, useState } from "react";
// Library
export default function Library() {
  const { data: session, status } = useSession();

  const [wantToRead, setWantToRead] = useState<{
    books: BookData[];
    authorsDictionary: Record<string, string>;
  } | null>(null);

  useEffect(() => {
    async function fetchWantToReadData() {
      const data = await UserClient.getWantToRead();
      setWantToRead(data);
    }

    fetchWantToReadData();
  }, []);

  if (status === "unauthenticated") {
    return redirect("/");
  }
  return (
    <div>
      <div id="want-to-read">
        {/* Want to read section */}
        <h1 className="text-xl font-bold">Want to Read</h1>
        <div className="flex flex-wrap">
          {wantToRead?.books &&
            wantToRead?.books.length > 0 &&
            wantToRead?.books.map((book: BookData) => {
              return (
                <BookCard
                  key={book!.key}
                  title={book!.title}
                  author={
                    wantToRead.authorsDictionary[book!.authors[0].author!.key!]
                  }
                  id={book!.key}
                  url={`/library/?`}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}
