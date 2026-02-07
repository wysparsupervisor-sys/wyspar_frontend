import Particles from "react-tsparticles";
import { useCallback } from "react";
import { loadLinksPreset } from "tsparticles-preset-links";

export default function StarsBackground2({...props}){
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
      color: {value: ["#970026ff", "#ffffffff", "#000090" ]},
      opacity: { value: 0.4 },
      links: {
        enable: false,
      },
      move: { speed: 1, straight: false, outModes: { default:"bounce" } }
      
    }
  }} className="absolute inset -z-1" {...props}/>
}