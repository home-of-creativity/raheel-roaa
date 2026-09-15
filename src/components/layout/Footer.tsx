import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { PHONES, buildWhatsAppUrl } from "@/src/lib/whatsapp";

const navItems = [
  { href: "#about", key: "about" },
  { href: "#journey", key: "journey" },
  { href: "#services", key: "services" },
  { href: "#why-us", key: "whyUs" },
  { href: "#partners", key: "partners" },
  { href: "#contact", key: "contact" },
] as const;

export async function Footer() {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const tContact = await getTranslations("contact");
  const tWa = await getTranslations("whatsapp");
  const year = new Date().getFullYear();

  return (
    <footer id="site-footer" className="border-t border-white/10 bg-ink text-paper/65">
      <div className="section-shell grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/media/logo.png" alt="" width={48} height={48} className="h-12 w-12" />
            <span className="leading-tight">
              <span className="block font-arabic text-base font-semibold text-paper">رحيل ورؤى</span>
              <span className="block text-[0.6rem] font-medium uppercase tracking-[0.28em] text-gold/80">
                Raheel & Roaa
              </span>
            </span>
          </div>
          <p className="mt-6 max-w-xs font-arabic text-sm leading-relaxed text-paper/55">
            {t("tagline")}
          </p>
        </div>

        <nav aria-label={t("navLabel")}>
          <h2 className="eyebrow text-paper/35">{t("navLabel")}</h2>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-1">
            {navItems.map((item) => (
              <li key={item.key}>
                <a
                  href={item.href}
                  className="text-sm transition-colors duration-300 hover:text-gold"
                >
                  {tNav(item.key)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="eyebrow text-paper/35">{tContact("kicker")}</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {PHONES.map((phone) => (
              <li key={phone.href}>
                <a
                  href={phone.href}
                  className="transition-colors duration-300 hover:text-gold"
                >
                  <bdi dir="ltr">{phone.label}</bdi>
                </a>
              </li>
            ))}
            <li className="pt-1 text-paper/50">{tContact("address")}</li>
            <li className="pt-2">
              <a
                href={buildWhatsAppUrl(tWa("message"))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-xs font-semibold text-gold transition-colors duration-300 hover:bg-gold hover:text-ink"
              >
                {tContact("whatsapp")}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section-shell flex flex-col gap-2 py-6 text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            <bdi dir="ltr">© {year} RAHEEL &amp; ROAA.</bdi> {t("rights")}
          </p>
          <p className="uppercase tracking-[0.12em] sm:tracking-[0.2em]">Damascus · Dubai · Riyadh · Tbilisi</p>
        </div>
      </div>
    </footer>
  );
}
