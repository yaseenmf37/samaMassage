import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const vazir = Vazirmatn({ subsets: ["arabic"] });

export const metadata: Metadata = {
  title: "هیراد کد | شرکت طراحی و توسعه وب",
  description:
    "شرکت هیراد کد ارائه دهنده خدمات طراحی و توسعه وب، وردپرس و برنامه‌نویسی",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body className={vazir.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
