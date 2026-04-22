"use client";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useCallback } from "react";
import { loadLinksPreset } from "@tsparticles/preset-links";

export default function BubblesBackground({...props}){
  const particleInit = useCallback(async (engine) => {
    await loadLinksPreset(engine)
  }, []);

  return <Particles init={particleInit} options={{
    fpsLimit: 20,
    pauseOnBlur: true,
    detectRetina: false,
    preset: "links",
    particles: {
      number: { value: 15 },
      size: { value: { max: 100, min: 10 } },
      color: {value: ["#ff0040ff", "#0051ffff", "#ffffffff" ]},
      opacity: { value: 0.1 },
      links: {
        enable: false,
      },
      move: { speed: 1, straight: false }
      
    }
  }} className="absolute inset -z-1" {...props}/>
}