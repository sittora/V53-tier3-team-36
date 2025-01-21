import connectDb from "@/lib/mongodb/mongodb";
import { UserModel } from "@/lib/schemas/user.schema";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  callbacks: {
    signIn: async ({ profile }) => {
      // Check if the user exists in our database, if they don't, add them

      try {
        await connectDb();
        const existingUser = await UserModel.findOne({
          where: { email: profile?.email },
        });

        if (!existingUser) {
          await UserModel.create({
            email: profile?.email,
            name: profile?.name,
          });
        }
      } catch (error) {
        console.error(error);
        return false;
      }

      return true;
    },
  },
});
