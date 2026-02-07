"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";


export default function ClickEffect({children, className, p=1.5, ...props}){
    const controls = useAnimation();
    
    const handleTap = async () => {
        await controls.start({
            scale: [1, p, 1],
            transition: {
                duration: 0.5,
                times: [0, 0.5, 1]
            }
        });
    };

    useEffect(() => {
        return () => { controls.stop() };
    }, [controls]);

    return (
        <div><motion.div className={`flex flex-row items-center justify-center ${className}`} animate={controls} onTap={handleTap} {...props}>{children}</motion.div></div>
    );
};