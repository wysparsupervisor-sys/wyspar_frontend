"use client";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useCallback } from "react";
import { loadLinksPreset } from "@tsparticles/preset-links";

export default function LinksBackground2({...props}){
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
      size: { value: { max: 7, min: 2 } },
      color: {value: ["#970026ff", "#ffffffff", "#000090" ]},
      opacity: { value: 0.5 },
      links: {
        enable: true,
        distance: 50,
        color: "#ffffffff",
        opacity: 0.5,
      },
      move: { speed: 1, straight: false, outModes: { default:"bounce" } }
    }
  }} className="absolute inset -z-1" {...props}/>
}