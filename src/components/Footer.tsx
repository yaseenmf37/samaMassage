import Link from "next/link";
import { site } from "@/lib/site";
import EnamadSeal from "@/components/EnamadSeal";

export default function Footer() {
  return (
    <footer id="contact" className="bg-forest-800 text-forest-50 pt-16 pb-8 mt-8">
      <div className="container-x">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* برند */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌿</span>
              <span className="text-xl font-extrabold">سما ماساژ</span>
            </div>
            <p className="text-forest-100/80 text-sm leading-7">
              {site.tagline}؛ تجربه‌ای از آرامش عمیق با کادری حرفه‌ای و محیطی
              دلنشین.
            </p>

            {/* نماد اعتماد الکترونیکی (اینماد) */}
            <div className="mt-6 bg-white rounded-xl p-2 inline-block">
              <EnamadSeal />
            </div>
          </div>

          {/* دسترسی سریع */}
          <div>
            <h3 className="font-bold mb-4 text-gold-light">دسترسی سریع</h3>
            <ul className="space-y-2 text-sm text-forest-100/80">
              <li>
                <Link href="/#services" className="hover:text-white">
                  خدمات ماساژ
                </Link>
              </li>
              <li>
                <Link href="/#booking" className="hover:text-white">
                  رزرو نوبت
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  سوالات متداول
                </Link>
              </li>
            </ul>
          </div>

          {/* تماس */}
          <div>
            <h3 className="font-bold mb-4 text-gold-light">راه‌های ارتباط</h3>
            <ul className="space-y-3 text-sm text-forest-100/80">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>{site.address}</span>
              </li>
              {site.phone && (
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <a href={`tel:${site.phoneRaw}`} className="hover:text-white" dir="ltr">
                    {site.phone}
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2">
                <span>🕐</span>
                <span>{site.hours}</span>
              </li>
              {site.instagram && (
                <li className="flex items-center gap-2">
                  <span>📸</span>
                  <a
                    href={site.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    اینستاگرام
                  </a>
                </li>
              )}
              <li className="flex items-center gap-2">
                <span>🤖</span>
                <span>روبیکا: {site.rubika}</span>
              </li>
            </ul>
          </div>

          {/* نقشه */}
          <div>
            <h3 className="font-bold mb-4 text-gold-light">موقعیت روی نقشه</h3>
            <div className="rounded-2xl overflow-hidden border border-forest-600 shadow-soft">
              <iframe
                title="نقشه سما ماساژ"
                src={`https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&hl=fa&z=15&output=embed`}
                width="100%"
                height="160"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-forest-600/50 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-forest-100/60">
          <p>
            © {new Date().getFullYear()} سما ماساژ — تمامی حقوق محفوظ است.
          </p>
          <Link href="/admin" className="hover:text-white">
            ورود مدیریت
          </Link>
        </div>
      </div>
    </footer>
  );
}
