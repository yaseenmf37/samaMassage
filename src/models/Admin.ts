import mongoose from "mongoose";

// ادمین‌های ربات روبیکا + وضعیت موقت برای ورودی چندمرحله‌ای
const adminSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true, unique: true },
    firstName: { type: String },
    // وضعیت منتظرِ ورودی بعدی، مثل: { action: "await_time", date: "1403/05/20" }
    pending: {
      action: { type: String, default: null },
      date: { type: String, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);
