import TrendingBooks from "@/components/trendingBooks/TrendingBooks";
import Dialog from "components/dialog/Dialog";
import { auth } from "@/auth/auth";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  async function onClose() {
    "use server"
    console.log("Modal has closed")
  }

  async function onAddToRead() {
      "use server"
      console.log("Add to Read")
  }

  async function onAddToWantToRead() {
    "use server"
    console.log("Add to Want To Read")
}

  return (
    <div className="w-full">
      <TrendingBooks />
      <Dialog onClose={onClose} onAddToRead={onAddToRead} onAddToWantToRead={onAddToWantToRead} loggedIn={user === undefined ? false : true} />
    </div>
  );
}
