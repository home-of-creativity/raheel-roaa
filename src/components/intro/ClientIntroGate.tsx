"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const CinematicIntro = dynamic(
  () => import("./CinematicIntro").then((mod) => mod.CinematicIntro),
  { ssr: false },
);

type ClientIntroGateProps = {
  children: ReactNode;
};

export function ClientIntroGate({ children }: ClientIntroGateProps) {
  return <CinematicIntro>{children}</CinematicIntro>;
}
