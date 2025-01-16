import mongoose, { Schema } from "mongoose";
import { User } from "../schemas/user.schema";

// TODO: this model should be expanded. This is just data to get started.
const userSchema = new Schema<User>({
  email: { type: String, required: true },
  name: { type: String, required: true },
  imageUrl: { type: String },
});

export const UserModel: mongoose.Model<User> =
  mongoose.models.User || mongoose.model<User>("User", userSchema);
