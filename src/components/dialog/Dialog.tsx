"use client";
import { User } from "@/lib/models/user.model";
import { AuthorData, BookAction, BookData } from "@/types/open-library";
import { BookClient } from "app/clients/book-client";
import { OpenLibrary } from "app/clients/open-library-client";
import { UserClient } from "app/clients/user-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import StarRating from "../star-rating/StarRating";

type Props = {
  loggedIn: boolean;
};

export default function Dialog({ loggedIn }: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  const showDialog = searchParams.get("showDialog");
  const bookId = searchParams.get("work");

  const [bookData, setBookData] = useState<BookData>(null);
  const [lumiBookRatingData, setLumiBookRatingData] = useState<{
    userRating: number | null;
    averageRating: number | null;
  } | null>(null);
  const [authorData, setAuthorData] = useState<AuthorData>(null);
  const [loading, setLoading] = useState(false);

  const [userContext, setUserContext] = useState<User | null>(null);

  async function onBookActionTaken(olId: string, action: BookAction) {
    try {
      switch (action) {
        case "read":
          await BookClient.markRead(olId, new Date());
          break;
        case "wantToRead":
          await BookClient.markWantToRead(olId);
          break;
        case "remove_read":
          await BookClient.undoMarkRead(olId);
          break;
        case "remove_wantToRead":
          await BookClient.undoMarkWantToRead(olId);
          break;
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  }

  useEffect(() => {
    if (showDialog === "y") {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [showDialog]);

  useEffect(() => {
    setLoading(true);

    const getBookData = async () => {
      const bookData = await OpenLibrary.getBookById(bookId!);
      setBookData(bookData);
    };

    if (bookId) {
      getBookData();
    }
  }, [bookId]);

  useEffect(() => {
    const getUserContext = async () => {
      const response = await UserClient.getUser();
      setUserContext(response);
    };

    getUserContext();
  }, [bookId]);

  useEffect(() => {
    if (bookId) getBookRatingData();
  }, [bookId]);

  useEffect(() => {
    if (bookData?.authors) {
      const getAuthorData = async () => {
        const authorKey = bookData.authors[0].author.key;
        const authorData = await OpenLibrary.getAuthorData(authorKey);
        setAuthorData(authorData);
      };
      getAuthorData().catch(console.error);
    }
    setLoading(false);
  }, [bookData]);

  const getBookRatingData = async () => {
    const response = await BookClient.getBookRatingById(bookId!);
    setLumiBookRatingData(response);
  };

  function isOnUserReadList(): boolean {
    if (!userContext) return false;
    if (!bookData) return false;
    return userContext.read.includes(bookData.key);
  }

  function isOnWantToReadList(): boolean {
    if (!userContext) return false;
    if (!bookData) return false;
    return userContext.wantToRead.includes(bookData.key);
  }

  const closeDialog = () => {
    dialogRef.current?.close();
    router.back();
  };

  const handleBookActionTaken = (action: BookAction) => {
    if (bookData) {
      onBookActionTaken(bookData.key, action);
    }
    closeDialog();
  };

  const handleUpdateRating = async (rating: number) => {
    // If the rating is -1  then delete the rating
    if (rating === -1) {
      try {
        if (bookData) {
          await BookClient.deleteRating(bookData.key!);
          // Refresh the rating data
          await getBookRatingData();
        }
      } catch (error) {
        console.error("Failed to delete rating", (error as Error).message);
      }
    } else {
      try {
        if (bookData) {
          await BookClient.rateBook(bookData.key!, rating);
          await getBookRatingData();
        }
      } catch (error) {
        console.error("failed to rate book", (error as Error).message);
      }
    }
  };

  const dialog = showDialog === "y" && (
    <dialog
      ref={dialogRef}
      className="fixed top-50 left-50 -translate-x-50 -translate-y-50 z-10 rounded-xl backdrop:bg-gray-800/50"
    >
      <div className="md:w-[500px] max-w-fullbg-gray-200 flex flex-col border">
        <div className="flex flex-row justify-end pt-2 px-5">
          <button
            onClick={closeDialog}
            className="mb-2 py-1 px-2 cursor-pointer rounded border w-8 h-8 font-bold text-black"
          >
            X
          </button>
        </div>
        <div className="px-5 pb-6">
          {loading && <span>Loading...</span>}
          {bookData && authorData && (
            <div>
              <h1 className="text-3xl font-bold">{bookData.title}</h1>
              <h4 className="text-lg italic pb-3">{authorData.name}</h4>
              <div className="pb-3">
                {bookData.subjects
                  ?.slice(0, 5)
                  .map((subject: string, i: number) => (
                    <span key={i}>
                      {subject}
                      {i !== 4 && ","}{" "}
                    </span>
                  ))}
              </div>
              <span>
                {bookData.description &&
                  (typeof bookData.description === "string"
                    ? bookData.description
                    : bookData.description.value)}
              </span>
              <div className="mt-2">
                {/* Ratings */}
                <div id="averageRating">
                  <StarRating
                    // ratingProps={
                    //   lumiBookRatingData
                    //     ? lumiBookRatingData.averageRating!
                    //     : null
                    // }
                    ratingProps={lumiBookRatingData!.averageRating}
                    title="Average Rating"
                    readOnly
                  />
                </div>
                <div id="userRating">
                  <StarRating
                    // ratingProps={
                    //   lumiBookRatingData ? lumiBookRatingData.userRating! : null
                    // }
                    ratingProps={lumiBookRatingData!.userRating}
                    title="My Rating"
                    onRatingChanged={handleUpdateRating}
                  />
                </div>
              </div>
            </div>
          )}
          {loggedIn && (
            <div className="flex flex-row justify-end mt-2">
              {!isOnUserReadList() ? (
                <button
                  onClick={() => handleBookActionTaken("read")}
                  className="bg-green-500 py-1 px-2 rounded border-none mr-2"
                >
                  Add to Read
                </button>
              ) : (
                <button
                  className="bg-orange-500 py-1 px-2 rounded border-none mr-2"
                  onClick={() => handleBookActionTaken("remove_read")}
                >
                  Remove from read List
                </button>
              )}
              {!isOnWantToReadList() ? (
                <button
                  onClick={() => handleBookActionTaken("wantToRead")}
                  className="bg-green-500 py-1 px-2 rounded border-none"
                >
                  Add to Want To Read
                </button>
              ) : (
                <button
                  className="bg-orange-500 py-1 px-2 rounded border-none mr-2"
                  onClick={() => handleBookActionTaken("remove_wantToRead")}
                >
                  Remove from want-to-read list
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );

  return dialog;
}
