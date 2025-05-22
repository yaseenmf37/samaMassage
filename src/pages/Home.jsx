import React, { useRef } from "react";
import Booking from "../components/booking/booking";
import Desc from "../components/desc";
import Servises from "../components/Servises";

function Home() {
  const bookingRef = useRef(null); // ساخت ref برای بخش رزرو
  return (
    <div className="w-full bg-[#a8d5ba]">
      <div className="max-w-[1440px] flex m-auto items-center flex-col">
        <div className="w-full mt-14">
          <img
            src="/img.png"
            alt="massage"
            className="w-full max-h-[40rem] object-cover rounded-3xl"
          />
        </div>
        <div className="w-full mt-10 cursor-default">
          <Desc />
        </div>
        <div className="mt-20 w-full " id="booking" ref={bookingRef}>
          <Booking />
        </div>
        <div className="w-full my-20 cursor-default" id="services">
          <Servises />
        </div>
      </div>
    </div>
  );
}

export default Home;
