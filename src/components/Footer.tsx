import Link from "next/link";
import Image from "next/image"; // اگر آیکون یا لوگو دارید، Image را ایمپورت کنید

export default function Footer() {
  return (
    <footer className="bg-green-800 text-gray-200 py-12 md:py-16 mt-20">
      <div className="max-w-8xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Company Info / Logo */}
        <div className="col-span-1 md:col-span-3 lg:col-span-1 flex flex-col items-center md:items-start">
          {/* اگر لوگو دارید، از این قسمت استفاده کنید */}
          {/* <div className="mb-4">
            <Image src="/logo.png" alt="سما ماساژ لوگو" width={100} height={100} />
          </div> */}
          <div className="text-2xl font-bold text-white mb-2">سما ماساژ</div>
          <p className="text-sm text-gray-400 text-center md:text-right">
            مرکز تخصصی ماساژ درمانی و ریلکسی با محیطی آرام و کادری مجرب. تجربه
            آرامش واقعی را با ما لمس کنید.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 border-b-2 border-green-600 pb-1 inline-block">
            لینک‌های مفید
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="hover:text-white transition-colors duration-200"
              >
                صفحه اصلی
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="hover:text-white transition-colors duration-200"
              >
                درباره ما
              </Link>
            </li>
            <li>
              <Link
                href="/faq"
                className="hover:text-white transition-colors duration-200"
              >
                سوالات متداول
              </Link>
            </li>
            {/* <li><Link href="/contact" className="hover:text-white transition-colors duration-200">تماس با ما</Link></li> */}
            {/* Add more links as needed */}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 border-b-2 border-green-600 pb-1 inline-block">
            تماس با ما
          </h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-center md:justify-start justify-center">
              {/* Placeholder for Location Icon */}
              <span className="ml-2">📍</span>
              آدرس شما در اینجا
            </p>
            <p className="flex items-center md:justify-start justify-center">
              {/* Placeholder for Phone Icon */}
              <span className="ml-2">📞</span>
              <a
                href="tel:+98912xxxxxxx"
                className="hover:text-white transition-colors duration-200"
              >
                شماره تماس شما
              </a>
            </p>
            <p className="flex items-center md:justify-start justify-center">
              {/* Placeholder for Email Icon */}
              <span className="ml-2">✉️</span>
              <a
                href="mailto:info@yourmassage.com"
                className="hover:text-white transition-colors duration-200"
              >
                ایمیل شما
              </a>
            </p>
          </div>
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4 border-b-2 border-green-600 pb-1 inline-block">
            شبکه‌های اجتماعی
          </h3>
          <div className="flex space-x-4 md:justify-start justify-center rtl:space-x-reverse">
            {/* Placeholder for Social Icons */}
            <a
              href="#"
              className="hover:text-white transition-colors duration-200 text-2xl"
            >
              👍
            </a>{" "}
            {/* Facebook */}
            <a
              href="#"
              className="hover:text-white transition-colors duration-200 text-2xl"
            >
              📸
            </a>{" "}
            {/* Instagram */}
            <a
              href="#"
              className="hover:text-white transition-colors duration-200 text-2xl"
            >
              🐦
            </a>{" "}
            {/* Twitter */}
            {/* Add more social links as needed */}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-12 border-t border-gray-700 pt-8 max-w-8xl mx-auto px-4 text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} سما ماساژ. تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}
