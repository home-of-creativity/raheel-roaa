const WHATSAPP_NUMBER = "963988781018";

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const PHONES = [
  { label: "+963 988 781 018", href: "tel:+963988781018", whatsapp: true },
  { label: "+966 59 980 2227", href: "tel:+966599802227" },
  { label: "+963 11 590 11 88", href: "tel:+963115901188" },
] as const;
