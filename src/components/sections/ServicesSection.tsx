"use client";

import { PublicImage } from "@/src/components/ui/PublicImage";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useState, type KeyboardEvent } from "react";
import { CompassMark } from "@/src/components/brand/CompassMark";
import { Button } from "@/src/components/ui/Button";
import { Reveal } from "@/src/components/ui/Reveal";
import { SectionHeading } from "@/src/components/ui/SectionHeading";
import { useReducedMotion } from "@/src/lib/useReducedMotion";

const stages = [
  {
    key: "flights",
    image: "/media/aviation-airport.png",
    object: "object-[52%_78%]",
  },
  {
    key: "destinations",
    image: "/media/services-travel.png",
    object: "object-[48%_70%]",
  },
  {
    key: "stays",
    image: "/media/partners-handshake.png",
    object: "object-[88%_78%]",
  },
  {
    key: "transport",
    image: "/media/hero-beyond-borders.png",
    object: "object-[78%_88%]",
  },
  {
    key: "business",
    image: "/media/business-meeting.png",
    object: "object-[42%_52%]",
  },
] as const;

type StageKey = (typeof stages)[number]["key"];

const TAB_PREFIX = "service-stage";
const PANEL_ID = "service-stage-panel";

export function ServicesSection() {
  const t = useTranslations("services");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const stage = stages[active];
  const progress = stages.length > 1 ? active / (stages.length - 1) : 0;

  const selectStage = useCallback((index: number, fromHover = false) => {
    if (fromHover && !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    setActive(index);
  }, []);

  const move = useCallback((next: number) => {
    const bounded = (next + stages.length) % stages.length;
    setActive(bounded);
    document.getElementById(`${TAB_PREFIX}-${bounded}`)?.focus();
  }, []);

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const rtlFlip = isRtl ? -1 : 1;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(index + rtlFlip);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(index - rtlFlip);
    } else if (event.key === "Home") {
      event.preventDefault();
      move(0);
    } else if (event.key === "End") {
      event.preventDefault();
      move(stages.length - 1);
    }
  };

  return (
    <section id="services" className="section-padding overflow-x-clip bg-sand">
      <div className="section-shell">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading kicker={t("kicker")} title={t("title")} lede={t("subtitle")} />
          <Reveal delay={0.1} className="w-full shrink-0 sm:w-auto">
            <Button href="#contact" variant="quiet" withArrow className="w-full sm:w-auto">
              {t("cta")}
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="mt-16 lg:mt-20">
          <div className="relative mb-12 lg:mb-16">
            <div
              className="pointer-events-none absolute inset-x-[6%] top-[1.15rem] hidden h-px bg-ink/10 lg:block"
              aria-hidden="true"
            >
              <motion.span
                className="block h-full origin-left bg-gold rtl:origin-right"
                animate={{ scaleX: progress }}
                transition={
                  reduced ? { duration: 0 } : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
                }
              />
            </div>

            <div
              role="tablist"
              aria-label={t("itinerary")}
              className="grid grid-cols-6 gap-2 lg:grid-cols-5 lg:gap-4"
            >
              {stages.map((item, index) => {
                const selected = index === active;
                return (
                  <button
                    key={item.key}
                    id={`${TAB_PREFIX}-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={PANEL_ID}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => selectStage(index)}
                    onMouseEnter={() => selectStage(index, true)}
                    onFocus={() => selectStage(index)}
                    onKeyDown={(event) => onTabKeyDown(event, index)}
                    className={`group/stop col-span-2 flex min-h-11 w-full items-center justify-center gap-1.5 rounded-full border px-2 py-2 text-center transition-colors duration-300 sm:gap-2 sm:px-3 lg:col-span-1 lg:min-h-0 lg:flex-col lg:items-center lg:gap-3 lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-1 ${
                      index === 3 ? "col-start-2 lg:col-start-auto" : ""
                    } ${
                      selected
                        ? "border-gold bg-gold/15 text-ink lg:bg-transparent"
                        : "border-ink/10 bg-paper/60 text-gray-muted lg:bg-transparent"
                    }`}
                  >
                    <span
                      className={`relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[0.65rem] font-semibold transition-[color,background-color,border-color,box-shadow] duration-500 ease-brand sm:h-8 sm:w-8 lg:h-9 lg:w-9 ${
                        selected
                          ? "border-gold bg-gold text-ink shadow-gold"
                          : "border-ink/15 bg-sand text-ink/45 group-hover/stop:border-gold/50 group-hover/stop:text-ink"
                      }`}
                    >
                      {selected ? <PlaneMark /> : `0${index + 1}`}
                    </span>
                    <span
                      className={`text-[0.7rem] font-medium leading-tight transition-colors duration-300 sm:text-sm ${
                        selected ? "text-ink" : "text-gray-muted"
                      }`}
                    >
                      {t(`${item.key}.title`)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            id={PANEL_ID}
            role="tabpanel"
            aria-labelledby={`${TAB_PREFIX}-${active}`}
          >
            <div
              className={`group relative overflow-hidden rounded-[1.5rem] shadow-raised sm:rounded-panel lg:rounded-se-[4.75rem] ${
                reduced
                  ? ""
                  : "origin-[70%_100%] transition-transform duration-700 ease-brand lg:-rotate-1 lg:hover:rotate-0"
              }`}
            >
              <div className="relative h-[14.5rem] sm:h-[clamp(16rem,42vw,36rem)]">
                {stages.map((item, index) => (
                  <PublicImage
                    key={item.key}
                    src={item.image}
                    alt={index === active ? t(`${item.key}.title`) : ""}
                    fill
                    sizes="(max-width: 1024px) 100vw, 76rem"
                    aria-hidden={index !== active}
                    className={`object-cover ${item.object} ${
                      reduced
                        ? ""
                        : "origin-center transition-[opacity,transform] duration-700 ease-brand group-hover:scale-105"
                    } ${index === active ? "opacity-100" : "opacity-0"}`}
                  />
                ))}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent lg:from-ink lg:via-ink/45 lg:to-ink/10"
                  aria-hidden="true"
                />
                <div
                  className="pointer-events-none absolute hidden text-gold/25 top-6 end-6 sm:block"
                  aria-hidden="true"
                >
                  <CompassMark size={132} opacity={1} showLabels={false} />
                </div>
                <p
                  className="pointer-events-none absolute font-display text-6xl leading-none text-paper/10 top-3 start-4 sm:text-[6.5rem] sm:start-5 lg:text-[9rem]"
                  aria-hidden="true"
                >
                  0{active + 1}
                </p>
              </div>

              <div className="bg-ink px-5 py-7 sm:px-10 sm:py-8 lg:absolute lg:inset-x-0 lg:bottom-0 lg:max-w-xl lg:bg-transparent lg:p-14">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={stage.key}
                    initial={reduced ? false : { opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduced ? undefined : { opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <p className="kicker text-gold">
                      {t("stageLabel", {
                        current: String(active + 1).padStart(2, "0"),
                        total: "05",
                      })}
                    </p>
                    <h3 className="font-display mt-4 text-2xl text-paper sm:text-4xl lg:text-section">
                      {t(`${stage.key as StageKey}.title`)}
                    </h3>
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/75 sm:text-lede">
                      {t(`${stage.key}.lede`)}
                    </p>
                    <ul className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-7 sm:gap-y-2">
                      {(t.raw(`${stage.key}.items`) as string[]).map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-sm text-paper/90">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button href="#contact" variant="outline" withArrow className="mt-8 w-full sm:w-auto">
                      {t("cta")}
                    </Button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PlaneMark() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 rtl:-scale-x-100" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18 10.2 12.2 8.4 9.1 2H7.6l1.6 6.2H4.7L3.2 6.4H2L3 10l-1 3.6h1.2l1.5-1.8h4.5L7.6 18h1.5l3.1-6.4 5.8-1.8V10.2Z"
      />
    </svg>
  );
}
