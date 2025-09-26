import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
    },

    role: {
      type: String,
      enum: [
        "owner",
        "md",
        "telecaller",
        "surveyor",
        "operator",
        "accountant",
        "monitor",
      ],
      required: true,
      default: "monitor",
    },

    // 1. Chairman / Owner
    // 2. Managin Director
    // 3. Telecaller
    // 4. Survayor
    // 5. Operator
    // 6. Accountant

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

    address: {
      type: String,
    },
    village: {
      type: String,
    },
    taluko: {
      type: String,
    },
    district: {
      type: String,
    },

    dob: {
      type: String,
    },
    addhar: {
      type: String,
    },
    age: {
      type: String,
    },

    education: {
      type: String,
    },
    experience: {
      type: String,
    },
    behaviour: {
      type: String,
    },

    work: {
      type: String,
    },

    account: {
      type: String,
    },
    payemntHistory: {
      type: Array,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
