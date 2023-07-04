import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String, required: true },
    birthdate: { type: Date, required: true },
    demands: { type: String },
    personalAnnotations: { type: String },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    timelines: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Timeline" }],
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);

export default Patient;
