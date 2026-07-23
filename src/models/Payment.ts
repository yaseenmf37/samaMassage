import mongoose from "mongoose";

// سشن پرداخت: قبل از تأیید پرداخت، اطلاعات رزرو به‌صورت موقت اینجا نگه‌داری می‌شود.
// رکورد Booking فقط پس از تأیید موفق پرداخت ساخته می‌شود؛ بنابراین وجود یک Booking
// همیشه به معنی «رزرو پرداخت‌شده» است و بقیه‌ی بخش‌ها (ادمین/ربات) نیازی به تغییر ندارند.
const paymentSchema = new mongoose.Schema(
  {
    authority: { type: String, required: true, index: true },
    amount: { type: Number, required: true }, // به ریال
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    refId: { type: String },
    // اطلاعات رزرو
    date: { type: String, required: true },
    time: { type: String, required: true },
    massageType: { type: String },
    name: { type: String },
    phone: { type: String },
    gender: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);
