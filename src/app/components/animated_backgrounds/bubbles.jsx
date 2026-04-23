"use client";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect } from "react";
import { loadLinksPreset } from "@tsparticles/preset-links";

export default function BubblesBackground({...props}){
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadLinksPreset(engine)
    })
  }, []);

  return <Particles options={{
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