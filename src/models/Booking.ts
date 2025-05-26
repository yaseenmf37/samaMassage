import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    time: { type: String, required: true },
    massageType: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);
