"use client";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect } from "react";
import { loadLinksPreset } from "@tsparticles/preset-links";

export default function StarsBackground({...props}){
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
      number: { value: 100 },
      size: { value: { max: 7, min: 2 } },
      color: {value: ["#800020ff", "#00cfcfff", "#ffffffff" ]},
      opacity: { value: 0.5 },
      links: {
        enable: true,
        distance: 60,
        color: "#ffffffff",
        opacity: 0.7,
      },
    }
  }} className="absolute inset -z-1" {...props}/>
}