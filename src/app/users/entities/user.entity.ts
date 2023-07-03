import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    patients: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Patient",
      },
    ],
    image: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "File",
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;