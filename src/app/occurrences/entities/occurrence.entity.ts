import mongoose from "mongoose";

const occurrenceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    content: { type: String, required: true },
    kind: {
      type: String,
      required: true,
    },
    files: [{ type: mongoose.SchemaTypes.ObjectId, ref: "File" }],
  },
  { timestamps: true }
);

const Occurrence = mongoose.model("Occurrence", occurrenceSchema);

export default Occurrence;
