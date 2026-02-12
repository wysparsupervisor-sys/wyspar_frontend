import { PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function StartButton({play, state, begin}){
    const { current, setCurrent } = state;
    const [isHidden, setIsHidden] = useState(current !== 1);

    useEffect(() => {
        setIsHidden(current !== 1);
    }, [current]);

    return (
        <div className={`flex-shrink-0 z-1 h-full w-full flex flex-col gap-3 items-center justify-center transition-all ease-out ${isHidden ? "opacity-0":"opacity-100"}`} style={{transitionDuration:"2s"}}>
            <h1 className="text-xl">Start your Journey</h1>
            <svg width={80} height={80} viewBox="0 0 80 80">
                <defs>
                    <motion.linearGradient gradientUnits="userSpaceOnUse" animate={{gradientTransform: ["rotate(0, 40, 40)", "rotate(360, 40, 40)"]}} transition={{duration: 5, repeat: Infinity, ease: "linear"}} id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ff0000ff"/>
                        <stop offset="100%" stopColor="#0026ffff"/>
                    </motion.linearGradient>
                </defs>

                <PlayCircle onClick={() => { play.current.play(); begin() }} stroke="url(#grad)" size={80} strokeWidth={1.5}/>
            </svg>
        </div>
    )
}