"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { useReducedMotion } from "@/src/lib/useReducedMotion";

type FlightPathProps = {
  className?: string;
  /** Flips the arc so consecutive dividers alternate direction. */
  flip?: boolean;
};

/**
 * Section divider echoing the dotted flight arcs in the brand key visuals.
 * Draws itself once when scrolled into view.
 */
export function FlightPath({ className = "", flip = false }: FlightPathProps) {
  const reduced = useReducedMotion();
  const maskId = useId();

  return (
    <svg
      viewBox="0 0 1200 80"
      preserveAspectRatio="none"
      className={`h-16 w-full ${flip ? "-scale-y-100" : ""} ${className}`}
      aria-hidden="true"
    >
      {/* Wipe mask keeps the dashes; `pathLength` would overwrite stroke-dasharray. */}
      <mask id={maskId}>
        <motion.rect
          width="1200"
          height="80"
          fill="#ffffff"
          className="origin-left [transform-box:fill-box]"
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </mask>
      <g mask={`url(#${maskId})`}>
        <path
          d="M0 62 C 260 62 360 14 600 14 C 840 14 940 62 1200 62"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeDasharray="7 9"
          strokeLinecap="round"
        />
        <circle cx="600" cy="14" r="4" fill="currentColor" />
      </g>
    </svg>
  );
}
