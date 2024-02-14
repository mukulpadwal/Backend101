import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Basic Approach
    // username: String,
    // email: String,
    // isActive: Boolean,

    // Professional Approach
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    isActive: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
