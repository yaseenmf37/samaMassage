import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    time: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.TimeSlot ||
  mongoose.model("TimeSlot", timeSlotSchema);
