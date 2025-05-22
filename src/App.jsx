// src/App.js
import React, { useEffect } from "react";
import Home from "./pages/Home";
import BookingForm from "./components/booking/BookingForm";
import Header from "./components/header";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import About from "./pages/about";
import Footer from "./components/Footer";
import Success from "./pages/success";
import Failed from "./pages/failed";
import FAQ from "./pages/FAQ";
import { ToastContainer } from "react-toastify";
import { bookingService } from "./services/bookingService";

function App() {
  useEffect(() => {
    console.log("Initializing available times...");
    bookingService
      .initializeAvailableTimes()
      .then(() => console.log("Available times initialization attempted."))
      .catch((error) =>
        console.error("Error initializing available times:", error)
      );
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#a8d5ba]">
      <Router>
        <Header />
        <main className="flex-1 mx-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<BookingForm />} />
            <Route path="/about" element={<About />} />
            <Route path="/success" element={<Success />} />
            <Route path="/failed" element={<Failed />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
    </div>
  );
}

export default App;
