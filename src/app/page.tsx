"use client";
import TrendingBooks from "@/components/trendingBooks/TrendingBooks";
import Dialog from "components/dialog/Dialog";
import { useSession } from "next-auth/react";
import { BookClient } from "./clients/book-client";

export default function Home() {
  const { data: session } = useSession();

  const user = session?.user;

  async function onClose() {
    console.log("Modal has closed");
  }

  async function onAddToRead(olId: string) {
    try {
      await BookClient.markRead(olId, new Date());
    } catch (error) {
      console.error((error as Error).message, "Failed to add to read");
    }
  }

  async function onAddToWantToRead(olId: string) {
    console.log("Add to Want To Read");
    try {
      await BookClient.markWantToRead(olId);
    } catch (error) {
      console.error((error as Error).message, "Failed to add to want to read");
    }
  }

  return (
    <div className="w-full">
      <TrendingBooks />
      <Dialog
        onClose={onClose}
        onAddToRead={onAddToRead}
        onAddToWantToRead={onAddToWantToRead}
        loggedIn={user === undefined ? false : true}
      />
    </div>
  );
}
