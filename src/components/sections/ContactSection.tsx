import { PublicImage } from "@/src/components/ui/PublicImage";
import { getTranslations } from "next-intl/server";
import { CompassMark } from "@/src/components/brand/CompassMark";
import { Button } from "@/src/components/ui/Button";
import { Reveal } from "@/src/components/ui/Reveal";
import { OfficeMap } from "@/src/components/sections/OfficeMap";
import { getGoogleApiKey, buildOfficeMapOpenUrl } from "@/src/lib/maps";
import { PHONES, buildWhatsAppUrl } from "@/src/lib/whatsapp";

const iconClass = "h-5 w-5 shrink-0 text-gold";

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24c5.5 0 9.96-4.46 9.96-9.96A9.9 9.9 0 0 0 12.04 2Zm0 1.83a8.1 8.1 0 0 1 8.12 8.13c0 4.49-3.64 8.13-8.12 8.13a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.08 8.08 0 0 1-1.25-4.29c0-4.49 3.65-8.13 8.2-8.13Zm-2.53 4.2c-.18 0-.47.07-.72.34-.25.27-.95.93-.95 2.26s.98 2.62 1.11 2.8c.14.18 1.9 2.9 4.6 4.06.64.28 1.14.44 1.53.57.64.2 1.23.17 1.69.1.51-.07 1.58-.64 1.81-1.27.22-.63.22-1.16.16-1.27-.07-.11-.25-.18-.52-.31-.27-.14-1.58-.78-1.83-.87-.24-.09-.42-.14-.6.13-.18.27-.68.87-.84 1.05-.15.18-.31.2-.58.07-.27-.14-1.13-.42-2.16-1.33-.8-.71-1.34-1.59-1.5-1.86-.15-.27-.01-.42.12-.55.12-.12.27-.31.4-.47.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.47-.07-.14-.6-1.45-.83-1.98-.21-.52-.43-.45-.59-.46h-.5Z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={iconClass}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 16.9v2.5a1.7 1.7 0 0 1-1.85 1.7 16.8 16.8 0 0 1-7.32-2.6 16.5 16.5 0 0 1-5.1-5.1A16.8 16.8 0 0 1 4.13 6a1.7 1.7 0 0 1 1.7-1.86h2.5a1.7 1.7 0 0 1 1.7 1.46c.1.82.3 1.62.58 2.38a1.7 1.7 0 0 1-.38 1.8l-1.06 1.05a13.6 13.6 0 0 0 5.1 5.1l1.05-1.06a1.7 1.7 0 0 1 1.8-.38c.76.28 1.56.48 2.38.59a1.7 1.7 0 0 1 1.46 1.72Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className={iconClass}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 10.5c0 5.4-8 12-8 12s-8-6.6-8-12a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10.5" r="2.8" />
    </svg>
  );
}

export async function ContactSection({ locale }: { locale: string }) {
  const t = await getTranslations("contact");
  const tWa = await getTranslations("whatsapp");
  const whatsappUrl = buildWhatsAppUrl(tWa("message"));
  const googleApiKey = getGoogleApiKey();
  const mapOpenUrl = buildOfficeMapOpenUrl();

  return (
    <section
      id="contact"
      className="grain relative isolate overflow-hidden bg-ink py-16 text-paper sm:py-24 lg:py-28"
    >
      <PublicImage
        src="/media/contact-journey.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover object-center opacity-[0.14]"
      />
      <div
        className="absolute inset-0 -z-10 bg-gradient-to-b from-ink via-ink/90 to-ink"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 -z-10 text-gold/[0.06] end-[-8rem]"
        aria-hidden="true"
      >
        <CompassMark size={460} showLabels={false} animated />
      </div>

      <div className="section-shell relative grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
        <Reveal>
          <p className="kicker text-gold">{t("kicker")}</p>
          <h2 className="font-display mt-6 text-section text-paper text-balance">{t("title")}</h2>
          <p className="mt-5 max-w-md text-lede text-paper/60">{t("subtitle")}</p>
          <Button
            href={whatsappUrl}
            size="lg"
            withArrow
            className="mt-9"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("cta")}
          </Button>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="rounded-panel border border-white/10 bg-white/[0.04] p-7 backdrop-blur-sm sm:p-9">
            <dl className="divide-y divide-white/10">
              <div className="flex items-start gap-4 pb-6">
                <WhatsAppIcon />
                <div>
                  <dt className="eyebrow text-paper/40">{t("whatsapp")}</dt>
                  <dd className="mt-1.5">
                    <a
                      href={whatsappUrl}
                      className="text-lg font-semibold text-paper transition-colors hover:text-gold"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <bdi dir="ltr">{PHONES[0].label}</bdi>
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-4 py-6">
                <PhoneIcon />
                <div>
                  <dt className="eyebrow text-paper/40">{t("phone")}</dt>
                  <dd className="mt-1.5 space-y-1.5">
                    {PHONES.map((phone) => (
                      <a
                        key={phone.href}
                        href={phone.href}
                        className="block text-lg font-semibold text-paper transition-colors hover:text-gold"
                      >
                        <bdi dir="ltr">{phone.label}</bdi>
                      </a>
                    ))}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-6">
                <PinIcon />
                <div>
                  <dt className="eyebrow text-paper/40">{t("location")}</dt>
                  <dd className="mt-1.5 text-lg font-semibold text-paper">
                    <a
                      href={mapOpenUrl}
                      className="transition-colors hover:text-gold"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {t("address")}
                    </a>
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>

      {googleApiKey ? (
        <Reveal delay={0.18} className="section-shell relative mt-12">
          <OfficeMap apiKey={googleApiKey} locale={locale} title={t("mapTitle")} />
        </Reveal>
      ) : null}
    </section>
  );
}
