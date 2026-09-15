"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { Reveal } from "@/src/components/ui/Reveal";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { useReducedMotion } from "@/src/lib/useReducedMotion";

const stepKeys = ["georgia", "dubai", "riyadh", "syria"] as const;

/** The waypoint dots sit on the arc itself, at the centre of each of the four columns
 *  below it. The curve is symmetric, so the same coordinates hold under RTL. */
const ARC = "M 20 120 C 200 120 240 34 500 34 C 760 34 800 120 980 120";
const WAYPOINTS = [
  { x: 125, y: 108.7 },
  { x: 375, y: 41.9 },
  { x: 625, y: 41.9 },
  { x: 875, y: 108.7 },
];

export function JourneySection() {
  const t = useTranslations("journey");
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.6"],
  });
  const drawn = useTransform(scrollYProgress, [0, 0.8], [0, 1]);

  return (
    <section
      id="journey"
      ref={containerRef}
      className="grain section-padding relative isolate overflow-hidden bg-ink text-paper"
    >
      {/* Anchored to the bottom edge so the visual's own title lockup crops away. */}
      <Image
        src="/media/journey-timeline.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 origin-bottom scale-[1.5] object-cover object-bottom opacity-[0.16]"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink via-ink/85 to-ink"
        aria-hidden="true"
      />

      <div className="section-shell relative">
        <SectionHeading
          tone="dark"
          kicker={t("kicker")}
          title={t("title")}
          lede={t("subtitle")}
        />

        {/* Desktop: a single drawn arc carrying four waypoints */}
        <div className="mt-20 hidden lg:block">
          <div className="relative">
            <svg viewBox="0 0 1000 150" className="h-auto w-full text-gold" aria-hidden="true">
              {/* Scroll-driven wipe. `pathLength` would replace stroke-dasharray and
                  turn the dotted flight path into a solid line. */}
              <mask id="journeyWipe">
                <motion.rect
                  width="1000"
                  height="150"
                  fill="#ffffff"
                  className="origin-left [transform-box:fill-box]"
                  style={{ scaleX: reduced ? 1 : drawn }}
                />
              </mask>
              <path d={ARC} fill="none" stroke="currentColor" strokeWidth="1" opacity="0.12" />
              <path
                d={ARC}
                mask="url(#journeyWipe)"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeDasharray="8 10"
                strokeLinecap="round"
              />
              {WAYPOINTS.map((point) => (
                <g key={point.x}>
                  <line
                    x1={point.x}
                    y1={point.y}
                    x2={point.x}
                    y2="150"
                    stroke="currentColor"
                    strokeWidth="0.75"
                    opacity="0.18"
                  />
                  <circle cx={point.x} cy={point.y} r="7" fill="currentColor" opacity="0.16" />
                  <circle cx={point.x} cy={point.y} r="3.2" fill="currentColor" />
                </g>
              ))}
            </svg>

            <ol className="mt-6 grid grid-cols-4 gap-6">
              {stepKeys.map((key, index) => (
                <Reveal as="li" key={key} delay={index * 0.12} className="relative text-center">
                  <span
                    className="pointer-events-none absolute -top-2 left-1/2 -translate-x-1/2 font-display text-7xl leading-none text-paper/[0.05]"
                    aria-hidden="true"
                  >
                    {t(`steps.${key}.year`)}
                  </span>
                  <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                    {t(`steps.${key}.year`)}
                  </p>
                  <h3 className="font-display relative mt-2 text-3xl text-paper">
                    {t(`steps.${key}.place`)}
                  </h3>
                  <p className="relative mx-auto mt-3 max-w-[15rem] text-sm leading-relaxed text-paper/55">
                    {t(`steps.${key}.description`)}
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>

        {/* Mobile: the same waypoints as a vertical rail */}
        <ol className="relative mt-14 border-s border-white/15 ps-8 lg:hidden">
          {stepKeys.map((key, index) => (
            <Reveal
              as="li"
              key={key}
              axis="x"
              distance={16}
              delay={index * 0.08}
              className="relative pb-10 last:pb-0"
            >
              <span
                className="absolute top-1.5 h-2.5 w-2.5 rounded-full bg-gold ring-4 ring-gold/20 start-[-2.3rem]"
                aria-hidden="true"
              />
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                {t(`steps.${key}.year`)}
              </p>
              <h3 className="font-display mt-1.5 text-2xl text-paper">
                {t(`steps.${key}.place`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/55">
                {t(`steps.${key}.description`)}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
