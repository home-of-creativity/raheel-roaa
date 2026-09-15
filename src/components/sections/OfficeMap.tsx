"use client";

import { useEffect, useRef, useState } from "react";
import { OFFICE_COORDINATES } from "@/src/lib/maps";

type OfficeMapProps = {
  apiKey: string;
  title: string;
  locale: string;
};

const GOLD = "#f5c518";
const INK = "#0b0b0d";

const MAP_STYLES: unknown[] = [
  { elementType: "geometry", stylers: [{ color: "#141418" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8b8b93" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: INK }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2b2b32" }] },
  { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: INK }] },
];

const PIN_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
  <path d="M24 2C13.5 2 5 10.3 5 20.6c0 12.4 19 32.4 19 32.4s19-20 19-32.4C43 10.3 34.5 2 24 2z" fill="${GOLD}"/>
  <circle cx="24" cy="21" r="7.5" fill="${INK}"/>
</svg>
`.trim();

const PIN_URL = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(PIN_SVG)}`;

type MapsApi = {
  Map: new (
    el: HTMLElement,
    opts: Record<string, unknown>,
  ) => { setOptions: (opts: Record<string, unknown>) => void };
  Marker: new (opts: Record<string, unknown>) => { addListener: (event: string, fn: () => void) => void };
  InfoWindow: new (opts: Record<string, unknown>) => { open: (opts: { map: unknown; anchor: unknown }) => void };
  Size: new (w: number, h: number) => unknown;
  Point: new (x: number, y: number) => unknown;
};

function getMapsApi(): MapsApi | null {
  const google = (window as unknown as { google?: { maps?: MapsApi } }).google;
  return google?.maps ?? null;
}

function loadMapsScript(apiKey: string, language: string): Promise<MapsApi> {
  const existing = getMapsApi();
  if (existing) return Promise.resolve(existing);

  const already = document.querySelector<HTMLScriptElement>("script[data-google-maps]");
  if (already) {
    return new Promise((resolve, reject) => {
      already.addEventListener("load", () => {
        const maps = getMapsApi();
        if (maps) resolve(maps);
        else reject(new Error("Maps failed to load"));
      });
      already.addEventListener("error", () => reject(new Error("Maps failed to load")));
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&language=${language}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.onload = () => {
      const maps = getMapsApi();
      if (maps) resolve(maps);
      else reject(new Error("Maps failed to load"));
    };
    script.onerror = () => reject(new Error("Maps failed to load"));
    document.head.appendChild(script);
  });
}

function buildEmbedUrl(apiKey: string, language: string) {
  const params = new URLSearchParams({
    key: apiKey,
    q: `${OFFICE_COORDINATES.lat},${OFFICE_COORDINATES.lng}`,
    zoom: "16",
    language,
  });
  return `https://www.google.com/maps/embed/v1/place?${params.toString()}`;
}

export function OfficeMap({ apiKey, title, locale }: OfficeMapProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [useEmbed, setUseEmbed] = useState(false);
  const language = locale === "ar" ? "ar" : "en";

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;

    loadMapsScript(apiKey, language)
      .then((maps) => {
        if (cancelled || !hostRef.current) return;

        try {
          (window as unknown as { gm_authFailure?: () => void }).gm_authFailure = () => {
            if (!cancelled) setUseEmbed(true);
          };

          const position = { lat: OFFICE_COORDINATES.lat, lng: OFFICE_COORDINATES.lng };
          const map = new maps.Map(hostRef.current, {
            center: position,
            zoom: 16,
            disableDefaultUI: true,
            zoomControl: true,
            gestureHandling: "greedy",
            scrollwheel: true,
            styles: MAP_STYLES,
            clickableIcons: false,
          });

          const safeTitle = title
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;");

          const marker = new maps.Marker({
            map,
            position,
            title,
            icon: {
              url: PIN_URL,
              scaledSize: new maps.Size(44, 52),
              anchor: new maps.Point(22, 52),
            },
          });

          const info = new maps.InfoWindow({
            content: `<p style="margin:0;font:600 14px/1.4 IBM Plex Sans,sans-serif;color:${INK}">${safeTitle}</p>`,
          });

          marker.addListener("click", () => {
            info.open({ map, anchor: marker });
          });
        } catch {
          setUseEmbed(true);
        }
      })
      .catch(() => {
        if (!cancelled) setUseEmbed(true);
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey, language, title]);

  return (
    <div className="relative overflow-hidden rounded-panel border border-white/10 bg-ink-raised">
      {useEmbed ? (
        <iframe
          src={buildEmbedUrl(apiKey, language)}
          title={title}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="h-[min(18rem,70vw)] w-full border-0 sm:h-[min(22rem,70vw)]"
        />
      ) : (
        <div
          ref={hostRef}
          role="region"
          aria-label={title}
          className="h-[min(18rem,70vw)] w-full sm:h-[min(22rem,70vw)]"
        />
      )}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
