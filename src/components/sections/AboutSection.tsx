import { PublicImage } from "@/src/components/ui/PublicImage";
import { getTranslations } from "next-intl/server";
import { RouteMap } from "@/src/components/brand/RouteMap";
import { Button } from "@/src/components/ui/Button";
import { Reveal } from "@/src/components/ui/Reveal";
import { SectionHeading } from "@/src/components/ui/SectionHeading";

export async function AboutSection() {
  const t = await getTranslations("about");
  const tFooter = await getTranslations("footer");

  return (
    <section id="about" className="section-padding relative overflow-hidden bg-sand">
      <div
        className="pointer-events-none absolute -top-40 h-80 w-80 rounded-full bg-gold/10 blur-3xl start-[-10rem]"
        aria-hidden="true"
      />

      <div className="section-shell relative">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:items-start lg:gap-20">
          <div>
            <SectionHeading kicker={t("label")} title={t("title")} lede={t("body")} />

            <Reveal delay={0.1}>
              <blockquote className="mt-10 border-s-2 border-gold ps-6">
                <p className="font-display text-2xl leading-snug text-ink sm:text-3xl">
                  {tFooter("tagline")}
                </p>
              </blockquote>

              <Button href="#journey" variant="quiet" withArrow className="mt-10">
                {t("cta")}
              </Button>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="lg:pt-4">
            <RouteMap />
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative mt-20">
          <div className="relative overflow-hidden rounded-panel">
            <PublicImage
              src="/media/about-consultation.png"
              alt=""
              width={1400}
              height={800}
              className="h-[clamp(16rem,38vw,30rem)] w-full object-cover object-[50%_66%]"
              sizes="(max-width: 1024px) 100vw, 76rem"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent"
              aria-hidden="true"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              <p className="max-w-md font-display text-xl text-paper sm:text-2xl">
                {t("caption")}
              </p>
            </div>
          </div>
          {/* Gold rule anchoring the frame to the brand's diagonal motif */}
          <div
            className="absolute -bottom-3 h-1.5 w-32 rounded-full bg-gold start-8"
            aria-hidden="true"
          />
        </Reveal>
      </div>
    </section>
  );
}
