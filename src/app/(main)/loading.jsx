"use client";
import { motion } from "framer-motion";

export default function Loading(){
    return (
        <motion.div className="fixed top-0 left-0 w-full h-[2px] z-90 bg-gradient-to-r from-red-500 to-blue-400" animate={{x: ["-100%", "0%"]}} transition={{repeat: Infinity, repeatType: "loop", duration: 0.5, ease: "linear"}}>
            
        </motion.div>
    );
};