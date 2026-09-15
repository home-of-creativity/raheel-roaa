"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { buildWhatsAppUrl } from "@/src/lib/whatsapp";

export function WhatsAppFab() {
  const t = useTranslations("contact");
  const tWa = useTranslations("whatsapp");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={buildWhatsAppUrl(tWa("message"))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t("cta")}
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="group fixed z-50 inline-flex items-center gap-3 rounded-full bg-gold py-3.5 ps-4 pe-4 text-ink shadow-gold transition-colors hover:bg-gold-bright bottom-[max(1.25rem,env(safe-area-inset-bottom))] end-[max(1rem,env(safe-area-inset-inline-end,1rem))] sm:pe-5"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.49 0 9.95-4.46 9.95-9.96A9.9 9.9 0 0 0 19.08 4.9 9.9 9.9 0 0 0 12.04 2Zm0 1.83c2.17 0 4.2.85 5.74 2.38a8.07 8.07 0 0 1 2.38 5.75c0 4.49-3.65 8.13-8.13 8.13a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.08 8.08 0 0 1-1.24-4.3c0-4.48 3.65-8.12 8.2-8.12Zm-2.53 4.2c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.26s.98 2.62 1.11 2.8c.14.18 1.9 2.9 4.6 4.06.64.28 1.14.44 1.53.57.64.2 1.23.17 1.69.1.51-.07 1.58-.64 1.81-1.27.22-.63.22-1.16.16-1.27-.07-.11-.25-.18-.52-.31-.27-.14-1.58-.78-1.83-.87-.24-.09-.42-.14-.6.13-.18.27-.68.87-.84 1.05-.15.18-.31.2-.58.07-.27-.14-1.13-.42-2.16-1.33-.8-.71-1.34-1.59-1.5-1.86-.15-.27-.01-.42.12-.55.12-.12.27-.31.4-.47.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.47-.07-.14-.6-1.45-.83-1.98-.21-.52-.43-.45-.59-.46h-.5Z" />
          </svg>
          <span className="hidden text-sm font-semibold sm:inline">{t("whatsapp")}</span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
