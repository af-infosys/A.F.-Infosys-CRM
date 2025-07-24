import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "telecaller", "surveyor", "accountant", "operator", "md"],
      required: true,
      default: "operator",
    },

    work: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
