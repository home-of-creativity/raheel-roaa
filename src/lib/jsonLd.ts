export function travelAgencyJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "RAHEEL & ROAA",
    alternateName: "رحيل ورؤى",
    url: siteUrl,
    telephone: ["+963988781018", "+966599802227", "+963115901188"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Damascus",
      addressRegion: "Al-Tal",
      addressCountry: "SY",
    },
    inLanguage: ["ar", "en"],
  };
}
