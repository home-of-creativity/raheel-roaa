/** Al-Tal (التل), Damascus — WGS84. */
export const OFFICE_COORDINATES = {
  lat: 33.610278,
  lng: 36.310833,
} as const;

export const OFFICE_MAP_QUERY = "Al-Tal, Damascus, Syria";

export function getGoogleApiKey(): string | null {
  const key = process.env.GOOGLE_API_KEY;
  return key ? key : null;
}

export function buildOfficeMapOpenUrl(): string {
  const { lat, lng } = OFFICE_COORDINATES;
  return `https://www.google.com/maps?q=${lat},${lng}`;
}
