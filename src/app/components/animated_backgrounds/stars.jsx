"use client";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useCallback } from "react";
import { loadLinksPreset } from "@tsparticles/preset-links";

export default function StarsBackground({...props}){
  const particleInit = useCallback(async (engine) => {
    await loadLinksPreset(engine)
  }, []);

  return <Particles init={particleInit} options={{
    fpsLimit: 20,
    pauseOnBlur: true,
    detectRetina: false,
    preset: "links",
    particles: {
      number: { value: 30 },
      size: { value: { max: 5, min: 1 } },
      color: {value: ["#ff88a6ff", "#f8ff9aff", "#ffffffff" ]},
      opacity: { value: 0.4 },
      links: {
        enable: false,
      },
      move: { speed: 1, straight: false, outModes: { default:"bounce" } }
      
    }
  }} className="absolute inset -z-1" {...props}/>
}