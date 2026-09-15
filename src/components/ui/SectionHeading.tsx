import type { ReactNode } from "react";
import { Reveal } from "@/src/components/ui/Reveal";

type SectionHeadingProps = {
  kicker?: string;
  title: ReactNode;
  lede?: ReactNode;
  /** `dark` is for gold/ink backgrounds, `light` for paper and sand. */
  tone?: "light" | "dark";
  align?: "start" | "center";
  className?: string;
};

export function SectionHeading({
  kicker,
  title,
  lede,
  tone = "light",
  align = "start",
  className = "",
}: SectionHeadingProps) {
  const kickerColor = tone === "dark" ? "text-gold" : "text-gold-deep";
  const titleColor = tone === "dark" ? "text-paper" : "text-ink";
  const ledeColor = tone === "dark" ? "text-paper/65" : "text-gray-muted";
  const alignment =
    align === "center" ? "items-center text-center mx-auto" : "items-start text-start";

  return (
    <Reveal className={`flex max-w-2xl flex-col ${alignment} ${className}`}>
      {kicker && <p className={`kicker ${kickerColor}`}>{kicker}</p>}
      <h2 className={`font-display mt-5 text-section ${titleColor}`}>{title}</h2>
      {lede && <p className={`mt-5 max-w-xl text-lede ${ledeColor}`}>{lede}</p>}
    </Reveal>
  );
}
