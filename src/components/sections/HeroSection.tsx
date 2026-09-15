"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { CompassMark } from "@/src/components/brand/CompassMark";
import { Button } from "@/src/components/ui/Button";
import { useReducedMotion } from "@/src/lib/useReducedMotion";

const proofKeys = ["since", "markets", "clients"] as const;

export function HeroSection() {
  const t = useTranslations("hero");
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const backdropY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.72]);

  const enter = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0 },
  };
  const transition = (delay: number) => ({
    duration: 0.9,
    delay,
    ease: [0.22, 1, 0.36, 1] as const,
  });

  return (
    <section
      ref={sectionRef}
      className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-paper"
    >
      {/* Atmosphere: the key visual sits far back so the typography owns the stage. */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={reduced ? undefined : { y: backdropY }}
        aria-hidden="true"
      >
        {/* Scaled from the bottom edge so the key visual's own lockup and route map
            sit above the frame — only the skyline band is used as atmosphere. */}
        <Image
          src="/media/hero-beyond-borders.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="origin-bottom scale-[1.25] object-cover object-bottom opacity-60 sm:scale-[1.7]"
        />
      </motion.div>
      <div
        className="absolute inset-0 -z-10 bg-[radial-gradient(110%_75%_at_50%_45%,transparent_0%,var(--color-ink)_82%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-ink via-ink/70 to-transparent"
        aria-hidden="true"
      />

      {/* Flight arc drawn behind the headline */}
      <svg
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-gold/25"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Wiped in rather than animated with `pathLength`, which would replace
            stroke-dasharray and render the arc as a solid line. */}
        <mask id="heroWipe">
          <motion.rect
            width="1440"
            height="900"
            fill="#ffffff"
            className="origin-left [transform-box:fill-box]"
            initial={reduced ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          />
        </mask>
        <g mask="url(#heroWipe)">
          <path
            d="M-60 620 C 300 620 420 300 760 300 C 1080 300 1240 150 1520 120"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="8 12"
          />
          <circle cx="760" cy="300" r="5" fill="currentColor" />
          <circle cx="1240" cy="150" r="5" fill="currentColor" />
        </g>
      </svg>

      <div
        className="pointer-events-none absolute top-1/4 hidden text-gold/[0.07] lg:block end-[-9rem]"
        aria-hidden="true"
      >
        <CompassMark size={440} animated={!reduced} showLabels={false} />
      </div>

      <motion.div
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
        className="section-shell relative flex flex-1 flex-col justify-center pb-16 pt-32 sm:pt-36"
      >
        <motion.p
          variants={enter}
          initial={reduced ? false : "hidden"}
          animate="show"
          transition={transition(0.1)}
          className="kicker text-gold"
        >
          {t("kicker")}
        </motion.p>

        <motion.h1
          variants={enter}
          initial={reduced ? false : "hidden"}
          animate="show"
          transition={transition(0.2)}
          className="font-display mt-6 max-w-4xl text-hero text-paper text-balance"
        >
          {t("headlineLead")} <span className="gold-wash">{t("headlineAccent")}</span>
        </motion.h1>

        <motion.p
          variants={enter}
          initial={reduced ? false : "hidden"}
          animate="show"
          transition={transition(0.3)}
          className="mt-7 max-w-xl text-lede text-paper/70"
        >
          {t("subheadline")}
        </motion.p>

        <motion.div
          variants={enter}
          initial={reduced ? false : "hidden"}
          animate="show"
          transition={transition(0.4)}
          className="mt-8 flex flex-row flex-wrap items-center gap-2.5 sm:mt-10 sm:gap-3"
        >
          <Button href="#contact" size="md" withArrow>
            {t("ctaPrimary")}
          </Button>
          <Button href="#services" variant="outline" size="md">
            {t("ctaSecondary")}
          </Button>
        </motion.div>
      </motion.div>

      {/* Proof strip — every figure traces back to copy already on the page. */}
      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={transition(0.7)}
        className="relative z-10 border-t border-white/10 bg-ink/40 pb-10 backdrop-blur-sm"
      >
        <dl className="section-shell grid grid-cols-3 divide-x divide-white/10 rtl:divide-x-reverse">
          {proofKeys.map((key) => (
            <div key={key} className="px-1.5 py-4 text-center sm:px-3 sm:py-6">
              <dt className="eyebrow text-paper/45">{t(`proof.${key}.label`)}</dt>
              <dd className="font-display mt-1.5 text-xl text-gold sm:text-3xl">
                <bdi dir="ltr">{t(`proof.${key}.value`)}</bdi>
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[12] h-10 bg-gradient-to-b from-transparent to-sand"
        aria-hidden="true"
      />
    </section>
  );
}
