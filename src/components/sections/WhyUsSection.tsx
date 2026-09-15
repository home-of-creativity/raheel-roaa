"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Reveal } from "@/src/components/ui/Reveal";
import { SectionHeading } from "@/src/components/ui/SectionHeading";

const itemKeys = ["international", "satisfaction", "professional", "partnerships"] as const;

export function WhyUsSection() {
  const t = useTranslations("whyUs");

  return (
    <section id="why-us" className="section-padding bg-sand">
      <div className="section-shell">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <Reveal className="relative">
            {/* Offset gold frame — the image sits proud of its own outline */}
            <span
              className="pointer-events-none absolute -bottom-5 -top-5 hidden rounded-panel border border-gold/45 end-[-1.25rem] start-5 sm:block"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-panel shadow-raised">
              <Image
                src="/media/team-professional.png"
                alt=""
                width={800}
                height={900}
                className="h-[clamp(20rem,44vw,30rem)] w-full object-cover object-[50%_72%]"
                sizes="(max-width: 1024px) 100vw, 34rem"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-ink/35 to-transparent"
                aria-hidden="true"
              />
            </div>
          </Reveal>

          <div>
            <SectionHeading kicker={t("kicker")} title={t("title")} />

            <ol className="mt-10 divide-y divide-gray-soft border-t border-gray-soft">
              {itemKeys.map((key, index) => (
                <Reveal
                  as="li"
                  key={key}
                  delay={index * 0.08}
                  className="group flex gap-5 py-6 sm:gap-7"
                >
                  <span
                    className="font-display text-lg text-gold-deep/60 transition-colors duration-300 group-hover:text-gold-deep"
                    aria-hidden="true"
                  >
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{t(`items.${key}.title`)}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-muted">
                      {t(`items.${key}.description`)}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ol>

            <Reveal delay={0.1}>
              <p className="font-display mt-10 text-2xl leading-snug text-ink sm:text-3xl">
                {t("closing")}
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
