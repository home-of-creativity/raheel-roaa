"use client";

import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import type { ElementType, ReactNode } from "react";
import { useReducedMotion } from "@/src/lib/useReducedMotion";

type RevealProps = {
  children: ReactNode;
  /** Seconds of stagger before this element animates in. */
  delay?: number;
  /** Travel distance in px. Negative values enter from below the resting position. */
  distance?: number;
  /** Slide along the inline axis instead of the block axis. Flips automatically under RTL. */
  axis?: "y" | "x";
  as?: Extract<ElementType, "div" | "section" | "article" | "li" | "figure" | "p" | "span">;
  className?: string;
};

export function Reveal({
  children,
  delay = 0,
  distance = 24,
  axis = "y",
  as = "div",
  className,
}: RevealProps) {
  const reduced = useReducedMotion();
  const isRtl = useLocale() === "ar";
  const Tag = motion[as];

  const inlineOffset = isRtl ? -distance : distance;
  const hidden =
    axis === "y" ? { opacity: 0, y: distance } : { opacity: 0, x: inlineOffset };

  return (
    <Tag
      className={className}
      initial={reduced ? false : hidden}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -8% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}
