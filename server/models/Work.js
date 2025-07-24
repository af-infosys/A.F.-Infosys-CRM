import mongoose from "mongoose";

const workSchema = new mongoose.Schema(
  {
    sheetId: {
      type: String,
      required: true,
    },
    spot: {
      type: Object,
    },
  },

  { timestamps: true }
);

export default mongoose.model("Work", workSchema);
