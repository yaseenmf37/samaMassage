import BookingForm from "./BookingForm";

export default function Booking() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6 text-center">فرم رزرو ماساژ</h1>
        <BookingForm />
      </div>
    </div>
  );
}
