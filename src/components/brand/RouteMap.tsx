"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useReducedMotion } from "@/src/lib/useReducedMotion";

/** Plotted from real longitude/latitude so the shape reads as a region, not a doodle.
 *  `ly` places each year label clear of the route line. */
const destinations = [
  { id: "georgia", cx: 76, cy: 24, ly: 15 },
  { id: "dubai", cx: 143, cy: 84, ly: 96 },
  { id: "riyadh", cx: 88, cy: 86, ly: 97 },
  { id: "syria", cx: 35, cy: 50, ly: 41 },
] as const;

/** Chained arcs following the order the company actually travelled. */
const ROUTE = "M 76 24 Q 119 44 143 84 Q 116 98 88 86 Q 69 56 35 50";

export function RouteMap() {
  const t = useTranslations("about");
  const tJourney = useTranslations("journey.steps");
  const reduced = useReducedMotion();
  const [active, setActive] = useState<string>("georgia");

  const activeIndex = destinations.findIndex((d) => d.id === active);

  return (
    <figure className="m-0 w-full">
      <div className="grain relative overflow-hidden rounded-panel bg-ink p-5 shadow-raised sm:p-7">
        <figcaption className="mb-5 flex items-center justify-between gap-4">
          <span className="eyebrow text-paper/40">{t("mapHint")}</span>
          <span className="font-display text-sm text-gold">
            <bdi dir="ltr">
              {activeIndex + 1} / {destinations.length}
            </bdi>
          </span>
        </figcaption>

        <svg viewBox="0 0 180 112" className="h-auto w-full" role="img" aria-label={t("mapLabel")}>
          <defs>
            <pattern id="mapDots" width="5" height="5" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.45" fill="#ffffff" opacity="0.14" />
            </pattern>
            <linearGradient id="routeFade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d4a80f" />
              <stop offset="100%" stopColor="#ffdf5c" />
            </linearGradient>
          </defs>

          <rect width="180" height="112" fill="url(#mapDots)" />

          {/* A wipe mask draws the route in. Animating `pathLength` instead would
              overwrite stroke-dasharray and flatten the dashes into a solid line. */}
          <mask id="routeWipe">
            <motion.rect
              width="180"
              height="112"
              fill="#ffffff"
              className="origin-left [transform-box:fill-box]"
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
            />
          </mask>

          <path
            className="route-glow"
            mask="url(#routeWipe)"
            d={ROUTE}
            fill="none"
            stroke="url(#routeFade)"
            strokeWidth="1.4"
            strokeDasharray="3.5 4.5"
            strokeLinecap="round"
          />

          {destinations.map((dest) => {
            const isActive = active === dest.id;
            return (
              <g key={dest.id} className="transition-opacity duration-300">
                {isActive && (
                  <>
                    <circle cx={dest.cx} cy={dest.cy} r="6" fill="#f5c518" opacity="0.12" />
                    <circle
                      cx={dest.cx}
                      cy={dest.cy}
                      r="3.8"
                      fill="none"
                      stroke="#f5c518"
                      strokeWidth="0.5"
                      opacity="0.45"
                    />
                  </>
                )}
                <circle
                  cx={dest.cx}
                  cy={dest.cy}
                  r={isActive ? 2.4 : 1.7}
                  fill={isActive ? "#f5c518" : "#ffffff"}
                  opacity={isActive ? 1 : 0.5}
                  className="transition-all duration-300"
                />
                <text
                  x={dest.cx}
                  y={dest.ly}
                  textAnchor="middle"
                  fontSize="6"
                  fontWeight="600"
                  fill={isActive ? "#f5c518" : "#ffffff"}
                  opacity={isActive ? 1 : 0.4}
                  className="transition-all duration-300"
                >
                  {tJourney(`${dest.id}.year`)}
                </text>
              </g>
            );
          })}
        </svg>

        <ul className="mt-6 flex flex-wrap gap-2">
          {destinations.map((dest) => {
            const isActive = active === dest.id;
            return (
              <li key={dest.id}>
                <button
                  type="button"
                  onClick={() => setActive(dest.id)}
                  onMouseEnter={() => setActive(dest.id)}
                  onFocus={() => setActive(dest.id)}
                  aria-pressed={isActive}
                  className={`rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? "border-gold bg-gold text-ink"
                      : "border-white/15 text-paper/60 hover:border-gold/50 hover:text-paper"
                  }`}
                >
                  {tJourney(`${dest.id}.place`)}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-5 min-h-24 rounded-card border border-white/10 bg-white/[0.03] p-5" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
                {tJourney(`${active}.year`)}
              </p>
              <p className="font-display mt-1.5 text-2xl text-paper">
                {tJourney(`${active}.place`)}
              </p>
              <p className="mt-1.5 text-sm text-paper/60">{tJourney(`${active}.description`)}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </figure>
  );
}
