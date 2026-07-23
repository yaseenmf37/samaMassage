"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const nav = [
  { href: "/", label: "خانه" },
  { href: "/#services", label: "خدمات" },
  { href: "/#booking", label: "رزرو نوبت" },
  { href: "/about", label: "درباره ما" },
  { href: "/faq", label: "سوالات متداول" },
  { href: "/#contact", label: "تماس" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-cream/90 backdrop-blur-md shadow-card"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="text-xl md:text-2xl font-extrabold text-forest-800">
            سما ماساژ
          </span>
        </Link>

        {/* دسکتاپ */}
        <nav className="hidden md:flex items-center gap-7">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-forest-700 font-semibold hover:text-gold-dark transition-colors"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/#booking" className="btn-primary !py-2 !px-5 text-sm">
            رزرو آنلاین
          </Link>
        </nav>

        {/* موبایل */}
        <button
          aria-label="منو"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span
            className={`block h-0.5 w-6 bg-forest-800 transition-transform ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-forest-800 transition-opacity ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-forest-800 transition-transform ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* منوی کشویی موبایل */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 bg-cream/95 backdrop-blur-md ${
          open ? "max-h-96 border-t border-forest-100" : "max-h-0"
        }`}
      >
        <nav className="container-x flex flex-col py-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="py-3 text-forest-700 font-semibold border-b border-forest-50 last:border-0"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#booking"
            onClick={() => setOpen(false)}
            className="btn-primary mt-3"
          >
            رزرو آنلاین نوبت
          </Link>
        </nav>
      </div>
    </header>
  );
}
