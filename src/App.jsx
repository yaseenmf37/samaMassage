// src/App.js
import React from "react";
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

function App() {
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
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
