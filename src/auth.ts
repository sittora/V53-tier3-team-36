import connectDb from "@/lib/mongodb/mongodb";
import { UserModel } from "@/lib/schemas/user.schema";
import NextAuth, { Account, Profile } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google, { GoogleProfile } from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google, GitHub],
  callbacks: {
    signIn: async ({ account, profile }) => {
      if (!profile) return false;
      if (!account) return false;

      try {
        await connectDb();
        const existingUser = await UserModel.findOne({
          email: profile.email,
        });

        if (!existingUser) {
          // Check if the user exists in our database, if they don't, add them
          await UserModel.create({
            email: profile.email,
            name: getUsernameFromProfile(account, profile),
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

function getUsernameFromProfile(account: Account, profile: Profile): string {
  if (account.provider === "google") {
    // For Google, combine the first and last name
    return `${(profile as GoogleProfile).given_name} ${
      (profile as GoogleProfile).family_name
    }`;
  }

  // Otherwise, just use the name
  return profile.name!;
}
