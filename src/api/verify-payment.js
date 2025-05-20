import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { bookingData } = req.body;

    // 1. ذخیره اطلاعات رزرو در Sheet1
    const bookingEndpoint =
      "https://v1.nocodeapi.com/hirad_code/google_sheets/OCYcMVSbTPlthojY?tabId=Sheet1";

    await axios.post(bookingEndpoint, [
      [
        bookingData.name,
        bookingData.phone,
        bookingData.gender,
        bookingData.massageType,
        bookingData.date,
        bookingData.time,
        bookingData.timestamp,
      ],
    ]);

    console.log("Booking saved to Sheet1:", bookingData);

    // 2. دریافت لیست تایم‌های موجود از Sheet2
    const slotsEndpoint =
      "https://v1.nocodeapi.com/hirad_code/google_sheets/KxyYWWEQsUFfClqY?tabId=Sheet2";

    const slotsResponse = await axios.get(slotsEndpoint);
    const allSlots = slotsResponse.data.data;

    console.log("Available slots from Sheet2:", allSlots);

    // 3. فیلتر کردن تایم رزرو شده از لیست
    const updatedSlots = allSlots.filter(
      (slot) =>
        !(slot.date === bookingData.date && slot.time === bookingData.time)
    );

    console.log("Updated slots:", updatedSlots);

    // 4. آپدیت Sheet2 با لیست جدید
    const updateSlotsEndpoint =
      "https://v1.nocodeapi.com/hirad_code/google_sheets/KxyYWWEQsUFfClqY?tabId=Sheet2";

    // تبدیل داده‌ها به فرمت مورد نیاز برای آپدیت
    const updateData = updatedSlots.map((slot) => [slot.date, slot.time]);

    // 5. پاک کردن تمام داده‌های قبلی و اضافه کردن داده‌های جدید
    await axios.post(updateSlotsEndpoint, {
      data: updateData,
      clear: true,
    });

    console.log("Sheet2 updated successfully");

    // پاک کردن اطلاعات موقت
    localStorage.removeItem("pendingBooking");

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error in payment verification:", error);
    res.status(500).json({ success: false, error: "خطا در ذخیره اطلاعات" });
  }
}
