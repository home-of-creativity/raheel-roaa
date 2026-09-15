"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useTranslations } from "next-intl";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CinematicScene, type CinematicRefs } from "./CinematicScene";
import { createIntroAudio } from "./introAudio";

gsap.registerPlugin(useGSAP);

type IntroContextValue = {
  introComplete: boolean;
  logoInNav: boolean;
};

export const IntroContext = createContext<IntroContextValue>({
  introComplete: false,
  logoInNav: false,
});

type CinematicIntroProps = {
  children: ReactNode;
};

export function CinematicIntro({ children }: CinematicIntroProps) {
  const t = useTranslations("intro");
  const [phase, setPhase] = useState<"pending" | "play" | "done">("pending");
  const [logoInNav, setLogoInNav] = useState(false);
  const [sceneRefs, setSceneRefs] = useState<CinematicRefs | null>(null);
  const reducedFx = useRef(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef(createIntroAudio());
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const finish = useCallback(() => {
    timelineRef.current?.kill();
    audioRef.current.stop();
    gsap.set(["#site-main", "#site-footer"], { autoAlpha: 1 });
    setLogoInNav(true);
    setPhase("done");
  }, []);

  const skip = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) {
      finish();
      return;
    }
    gsap.to(overlay, {
      autoAlpha: 0,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: finish,
    });
  }, [finish]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLogoInNav(true);
      setPhase("done");
      return;
    }
    reducedFx.current = window.innerWidth < 640;
    setPhase("play");
  }, []);

  const onReady = useCallback((refs: CinematicRefs) => {
    setSceneRefs(refs);
  }, []);

  useGSAP(
    () => {
      if (phase !== "play" || !sceneRefs || !overlayRef.current) return;

      audioRef.current.start();
      const { camera, look, plane, cloudsLeft, cloudsRight, sky, fog } = sceneRefs;
      const skyTone = { r: 0.62, g: 0.78, b: 0.91 };

      const tl = gsap.timeline({
        defaults: { ease: "power1.inOut" },
        onComplete: () => {
          audioRef.current.stop();
          setLogoInNav(true);
          setPhase("done");
        },
      });
      timelineRef.current = tl;

      if (skipRef.current) gsap.set(skipRef.current, { autoAlpha: 1 });
      gsap.set(["#site-main", "#site-footer"], { autoAlpha: 0 });
      gsap.set([cloudsLeft.scale, cloudsRight.scale], { x: 0.02, y: 0.02, z: 0.02 });

      // 1. Clear sky — greybox aircraft only
      tl.fromTo(
        plane.position,
        { x: -18, y: 0.35, z: 0 },
        { x: 2.2, y: 0.55, z: -1.2, duration: 2.4, ease: "none" },
        0,
      );
      tl.fromTo(plane.rotation, { z: 0.04 }, { z: -0.05, duration: 2.4, ease: "sine.inOut" }, 0);
      tl.fromTo(
        camera.position,
        { x: -6.5, y: 1.7, z: 9.2 },
        { x: -1.2, y: 1.5, z: 8.2, duration: 2.4, ease: "none" },
        0,
      );
      tl.fromTo(look, { x: -4, y: 0.4, z: 0 }, { x: 2.4, y: 0.5, z: -1.4, duration: 2.4, ease: "none" }, 0);

      // 2. Text clouds open: Raheel & Roaa
      tl.to(
        [cloudsLeft.scale, cloudsRight.scale],
        { x: 1, y: 1, z: 1, duration: 1.4, ease: "power2.out" },
        2.35,
      );
      tl.to(camera.position, { x: 0.2, y: 1.35, z: 11.5, duration: 1.5, ease: "power2.inOut" }, 2.35);
      tl.to(look, { x: 0, y: 1.1, z: -3, duration: 1.5 }, 2.35);
      tl.to(plane.position, { x: 10, y: 0.8, z: -8, duration: 1.1, ease: "power1.in" }, 2.45);

      // 3. Aircraft returns and splits the letter clouds
      tl.to(plane.position, { x: 0, y: -10, z: 6, duration: 0.01 }, 3.7);
      tl.to(
        plane.position,
        { x: 0.15, y: 1.2, z: -14, duration: 2.1, ease: "power3.inOut" },
        3.75,
      );
      tl.to(plane.rotation, { z: 0.12, x: 0.16, duration: 0.7, ease: "power2.out" }, 3.75);
      tl.to(plane.rotation, { z: 0, x: -0.04, duration: 1.3, ease: "power2.inOut" }, 4.4);
      tl.to(cloudsLeft.position, { x: -13, y: "+=0.6", duration: 1.6, ease: "power3.inOut" }, 4.15);
      tl.to(cloudsRight.position, { x: 13, y: "+=0.8", duration: 1.6, ease: "power3.inOut" }, 4.15);
      tl.to(camera.position, { x: 0.4, y: 2.2, z: 7.2, duration: 2.0, ease: "power2.inOut" }, 3.8);
      tl.to(look, { x: 0, y: 1.4, z: -10, duration: 2.0 }, 3.8);

      // 4. Sky darkens, motion continues into the site
      tl.to(
        skyTone,
        {
          r: 0.1,
          g: 0.1,
          b: 0.1,
          duration: 2.2,
          ease: "power2.inOut",
          onUpdate: () => {
            sky.setRGB(skyTone.r, skyTone.g, skyTone.b);
            fog.color.setRGB(skyTone.r, skyTone.g, skyTone.b);
          },
        },
        5.5,
      );
      tl.to(camera.position, { z: 4.4, y: 1.6, duration: 2.2, ease: "power2.inOut" }, 5.5);
      tl.to(plane.position, { z: -22, y: 2.2, duration: 2.2, ease: "power1.in" }, 5.5);
      tl.add(() => audioRef.current.impact(), 6.4);
      tl.add(() => audioRef.current.stop(), 6.7);
      tl.to(["#site-main", "#site-footer"], { autoAlpha: 1, duration: 0.85, ease: "power2.out" }, 6.7);
      tl.to(overlayRef.current, { autoAlpha: 0, duration: 0.9, ease: "power2.inOut" }, 6.85);

      return () => {
        tl.kill();
        audioRef.current.stop();
      };
    },
    { dependencies: [phase, sceneRefs] },
  );

  const contextValue = useMemo(
    () => ({ introComplete: phase === "done", logoInNav }),
    [phase, logoInNav],
  );

  return (
    <IntroContext.Provider value={contextValue}>
      <div className={phase === "play" ? "overflow-hidden" : undefined}>{children}</div>
      {phase === "play" && (
        <div ref={overlayRef} className="fixed inset-0 z-[90] bg-[#9ec8e8]" aria-hidden={false}>
          <div className="absolute inset-0">
            <CinematicScene onReady={onReady} reducedFx={reducedFx.current} />
          </div>

          <div className="absolute inset-0 flex flex-col justify-between px-6 py-8">
            <div className="flex w-full justify-end">
              <button
                ref={skipRef}
                type="button"
                onClick={skip}
                className="pointer-events-auto rounded-full border border-paper/30 bg-charcoal-deep/40 px-4 py-2 text-xs font-semibold text-paper backdrop-blur-sm hover:border-yellow hover:text-yellow"
                style={{ visibility: "hidden" }}
              >
                {t("skip")}
              </button>
            </div>
            <p className="text-center text-[10px] uppercase tracking-[0.35em] text-charcoal/45">
              {t("story")}
            </p>
          </div>
        </div>
      )}
    </IntroContext.Provider>
  );
}
