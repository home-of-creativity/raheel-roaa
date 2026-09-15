"use client";

import { PublicImage } from "@/src/components/ui/PublicImage";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Reveal } from "@/src/components/ui/Reveal";
import { SectionHeading } from "@/src/components/ui/SectionHeading";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "h-5 w-5 sm:h-6 sm:w-6",
  "aria-hidden": true,
} as const;

const categories: { key: string; icon: ReactNode }[] = [
  {
    key: "airlines",
    icon: (
      <svg {...iconProps}>
        <path d="M21 15.5 12.8 11V4.8a1.3 1.3 0 0 0-2.6 0V11L2 15.5v1.8l8.2-2.4v4.3l-2.4 1.6v1.2L11.5 21l3.7 1v-1.2l-2.4-1.6v-4.3l8.2 2.4Z" />
      </svg>
    ),
  },
  {
    key: "hotels",
    icon: (
      <svg {...iconProps}>
        <path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4h9A1.5 1.5 0 0 1 16 5.5V21M16 10h2.5A1.5 1.5 0 0 1 20 11.5V21M2 21h20M7.5 8h1.5M7.5 12h1.5M11.5 8H13M11.5 12H13M9 21v-4h2v4" />
      </svg>
    ),
  },
  {
    key: "tourism",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="m15.2 8.8-1.9 4.5-4.5 1.9 1.9-4.5Z" />
      </svg>
    ),
  },
  {
    key: "providers",
    icon: (
      <svg {...iconProps}>
        <path d="M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20.5a6.5 6.5 0 0 1 13 0M17 11.5a2.8 2.8 0 1 0 0-5.6M18.5 20.5a5.5 5.5 0 0 0-2.2-4.4" />
      </svg>
    ),
  },
];

export function PartnersSection() {
  const t = useTranslations("partners");

  return (
    <section id="partners" className="section-padding relative overflow-x-clip bg-paper">
      <div className="section-shell">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-x-16 lg:gap-y-8">
          <div className="lg:col-start-1 lg:row-start-1">
            <SectionHeading kicker={t("kicker")} title={t("title")} lede={t("subtitle")} />
          </div>

          <Reveal delay={0.08} className="lg:col-span-2 lg:row-start-2">
            <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-panel border border-gray-soft bg-gray-soft lg:grid-cols-4">
              {categories.map((category) => (
                <li
                  key={category.key}
                  className="group flex min-h-[5.75rem] flex-col gap-3 bg-paper px-4 py-5 transition-colors duration-300 ease-brand hover:bg-sand sm:min-h-0 sm:gap-4 sm:p-7"
                >
                  <span className="text-gold-deep transition-transform duration-300 ease-brand group-hover:-translate-y-0.5">
                    {category.icon}
                  </span>
                  <span className="text-xs font-semibold leading-snug text-ink sm:text-sm">
                    {t(`categories.${category.key}`)}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={0.12}
            className="relative overflow-hidden rounded-panel shadow-soft lg:col-start-2 lg:row-start-1"
          >
            <PublicImage
              src="/media/partners-handshake.png"
              alt=""
              width={800}
              height={600}
              className="aspect-[4/3] h-auto w-full object-cover object-[38%_52%] lg:aspect-auto lg:h-[clamp(16rem,28vw,22rem)] lg:object-[46%_50%]"
              sizes="(max-width: 1024px) 100vw, 36rem"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
