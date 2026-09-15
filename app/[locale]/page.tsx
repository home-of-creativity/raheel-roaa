import { setRequestLocale } from "next-intl/server";
import { AboutSection } from "@/src/components/sections/AboutSection";
import { AchievementsSection } from "@/src/components/sections/AchievementsSection";
import { ContactSection } from "@/src/components/sections/ContactSection";
import { HeroSection } from "@/src/components/sections/HeroSection";
import { JourneySection } from "@/src/components/sections/JourneySection";
import { PartnersSection } from "@/src/components/sections/PartnersSection";
import { ServicesSection } from "@/src/components/sections/ServicesSection";
import { WhyUsSection } from "@/src/components/sections/WhyUsSection";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <AboutSection />
      <JourneySection />
      <ServicesSection />
      <AchievementsSection />
      <WhyUsSection />
      <PartnersSection />
      <ContactSection locale={locale} />
    </>
  );
}
