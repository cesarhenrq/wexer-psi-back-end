import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    occurrences: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Occurrence" }],
  },
  { timestamps: true }
);

const Timeline = mongoose.model("Timeline", timelineSchema);

export default Timeline;
