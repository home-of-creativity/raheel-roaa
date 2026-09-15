"use client";

import { PublicImage } from "@/src/components/ui/PublicImage";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/src/components/ui/Button";

const navItems = [
  { href: "#about", key: "about" },
  { href: "#journey", key: "journey" },
  { href: "#services", key: "services" },
  { href: "#achievements", key: "achievements" },
  { href: "#why-us", key: "whyUs" },
  { href: "#partners", key: "partners" },
] as const;

const sectionIds = navItems.map((item) => item.href.slice(1));

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const otherLocale = locale === "ar" ? "en" : "ar";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight whichever section currently owns the upper third of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.5, 1] },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Lock the page behind the mobile drawer and allow Escape to dismiss it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      id="site-header"
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-brand pt-[env(safe-area-inset-top)] ${
        scrolled || open
          ? "border-b border-white/10 bg-ink/85 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-ink/60 to-transparent"
      }`}
    >
      <div
        className={`section-shell flex items-center justify-between gap-3 transition-all duration-500 ease-brand sm:gap-6 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <Link
          href={pathname}
          className="flex items-center gap-3"
          aria-label="RAHEEL & ROAA"
          onClick={() => setOpen(false)}
        >
          <PublicImage
            src="/media/logo.png"
            alt=""
            width={44}
            height={44}
            priority
            className={`transition-all duration-500 ease-brand ${scrolled ? "h-9 w-9" : "h-11 w-11"}`}
          />
          <span className="hidden leading-tight sm:block">
            <span className="block font-arabic text-sm font-semibold text-paper">رحيل ورؤى</span>
            <span className="block text-[0.6rem] font-medium uppercase tracking-[0.28em] text-gold/80">
              Raheel & Roaa
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {navItems.map((item) => {
            const isActive = active === item.href.slice(1);
            return (
              <a
                key={item.key}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={`relative py-1 text-sm transition-colors duration-300 ${
                  isActive ? "text-gold" : "text-paper/70 hover:text-paper"
                }`}
              >
                {t(item.key)}
                {isActive && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-0.5 inset-x-0 h-px bg-gold"
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            locale={otherLocale}
            className="rounded-full border border-paper/20 px-2.5 py-1.5 text-[0.7rem] font-semibold text-paper/80 transition-colors duration-300 hover:border-gold hover:text-gold sm:px-3.5 sm:text-xs"
            aria-label={t("languageToggle")}
          >
            {t("languageToggle")}
          </Link>

          <span className="hidden lg:inline-flex">
            <Button href="#contact" size="md" className="!py-2.5 !text-xs">
              {t("cta")}
            </Button>
          </span>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 text-paper transition-colors hover:border-gold hover:text-gold lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={t(open ? "closeMenu" : "openMenu")}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="relative block h-3.5 w-5">
              <span
                className={`absolute inset-x-0 top-0 h-0.5 bg-current transition-transform duration-300 ease-brand ${
                  open ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`absolute inset-x-0 top-[6px] h-0.5 bg-current transition-opacity duration-200 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute inset-x-0 top-[12px] h-0.5 bg-current transition-transform duration-300 ease-brand ${
                  open ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            aria-label="Mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/10 bg-ink/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="section-shell flex flex-col py-4">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + index * 0.04, duration: 0.3 }}
                  className="border-b border-white/5 last:border-0"
                >
                  <a
                    href={item.href}
                    className="flex items-baseline gap-3 py-3.5 text-lg text-paper/90 transition-colors hover:text-gold"
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-[0.65rem] font-semibold text-gold/50">
                      0{index + 1}
                    </span>
                    {t(item.key)}
                  </a>
                </motion.li>
              ))}
            </ul>
            <div className="section-shell pb-6">
              <Button
                href="#contact"
                size="lg"
                withArrow
                className="w-full"
                onClick={() => setOpen(false)}
              >
                {t("cta")}
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
