import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-green-500 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold">سما ماساژ</div>
        <nav>
          <Link href="/" className="ml-4 hover:underline">
            صفحه اصلی
          </Link>
          <Link href="/about" className="ml-4 hover:underline">
            درباره ما
          </Link>
          <Link href="/faq" className="ml-4 hover:underline">
            سوالات متداول
          </Link>
          {/* Add Contact Us link later if needed */}
        </nav>
      </div>
    </header>
  );
}
