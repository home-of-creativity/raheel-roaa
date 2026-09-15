"use client";

import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { CompassMark } from "@/src/components/brand/CompassMark";
import { Reveal } from "@/src/components/ui/Reveal";
import { useReducedMotion } from "@/src/lib/useReducedMotion";

type StatProps = {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
};

/** Years elsewhere on the page use Latin digits, so the counters match rather than
 *  switching to Arabic-Indic numerals under the `ar` locale. */
const NUMERALS = "en-US";

function AnimatedStat({ value, suffix, label, decimals = 0 }: StatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView || reduced) {
      setDisplay(value);
      return;
    }

    let frame = 0;
    const totalFrames = 56;
    let raf = 0;
    const tick = () => {
      frame += 1;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (frame < totalFrames) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value]);

  const formatted =
    decimals > 0
      ? display.toLocaleString(NUMERALS, {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })
      : Math.round(display).toLocaleString(NUMERALS);

  return (
    <div ref={ref} className="min-w-0 px-1 text-center sm:px-3">
      <p className="font-display text-xl leading-none text-ink sm:text-3xl lg:text-stat" dir="ltr">
        <span className="tabular-nums">{formatted}</span>
        <span className="text-ink/45">{suffix}</span>
      </p>
      <p className="eyebrow mt-2 whitespace-nowrap text-ink/60 sm:mt-4">{label}</p>
    </div>
  );
}

export function AchievementsSection() {
  const t = useTranslations("achievements");
  const reduced = useReducedMotion();

  return (
    <section
      id="achievements"
      className="grain relative isolate overflow-hidden bg-gold py-12 sm:py-24"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center text-ink/[0.045]"
        aria-hidden="true"
      >
        <CompassMark size={640} showLabels={false} animated={!reduced} />
      </div>

      <div className="section-shell relative">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="kicker justify-center text-ink/55">{t("kicker")}</p>
          <h2 className="font-display mt-5 text-section text-ink">{t("title")}</h2>
        </Reveal>

        <div className="mt-8 grid grid-cols-3 items-start gap-2 divide-x divide-ink/15 sm:mt-14 sm:gap-6 rtl:divide-x-reverse">
          <AnimatedStat value={5000} suffix="+" label={t("clients")} />
          <AnimatedStat value={9000} suffix="+" label={t("services")} />
          <AnimatedStat value={9.8} suffix="/10" label={t("satisfaction")} decimals={1} />
        </div>
      </div>
    </section>
  );
}
