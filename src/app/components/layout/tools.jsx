"use client";
import { ChevronDown, Feather, HatGlasses, MessageCircleQuestion, Plus } from "lucide-react";  
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ClockLoader } from "react-spinners";
import StarsBackground from "../animated_backgrounds/stars";
import { GetFromLocalStorage, SaveToLocalStorage } from "@/app/lib/utils/local-storage";
const MakePost = dynamic(() => import("../workshop/post"), { loading: () => <LoadingAnimation/>});
const MakeFeedback = dynamic(() => import( "../workshop/feedback"), { loading: () => <LoadingAnimation/>});
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";


function LoadingAnimation(){
    return (
        <div className="w-full bg-black h-full absolute z-2 flex flex-col items-center justify-center">
            <StarsBackground/>
            <ClockLoader color="white" size={100}/>
        </div>
    );
};


export default function Tools({className}){
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [isPosting, setIsPosting] = useState(searchParams.get("isposting") === "true");
    const [isFeedbacking, setIsFeedbacking] = useState(false);

    const [shouldPost, setShouldPost] = useState(null);

    useEffect(() => {
        //decide wether or not to show has posted notification
        const hasPosted = GetFromLocalStorage("has_posted");
        if (!hasPosted) {
            setShouldPost(true);
            SaveToLocalStorage("has_posted", true, 1000 * 60 * 60 * 24); //last a day;
        };
    }, []);

    return(
        <>
            <div className={`flex flex-col items-right justify-right gap-2 text-3xl fixed bottom-20 right-5 z-2 ${className}`}>            
                {isOpen && <div className="flex flex-row gap-3">
                    <div onClick={() => setIsPosting(true)} className="bg-[#000030] rounded-full p-2 border border-gray-700"><Feather/></div>
                    <div onClick={() => setIsFeedbacking(true)} className="bg-[#0a6464ff] rounded-full p-2 border border-gray-700"><MessageCircleQuestion/></div>
                </div>}
                <div className="bg-[rgb(0,161,153)] flex-grow-0 flex flex-row justify-center rounded-full p-3 border-2 border-white" onClick={() => setIsPosting(!isPosting)}>
                    {isOpen ? <ChevronDown size={30}/>:<Plus size={30} strokeWidth={3}/>}
                </div>
            </div>
            {isPosting && <>
                <MakePost pageIsOPen={setIsPosting}/>
            </>}
            {isFeedbacking && <MakeFeedback pageIsOpen={setIsFeedbacking}/>}
            <div>
                {shouldPost && <div className="fixed z-10 top-0 left-0 h-[100dvh] w-full bg-black/80 flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center gap-5">
                        <h1 className="text-lg">Reveal something today</h1>     
                        <svg width={75} height={75} viewBox="0 0 80 80">
                                <defs>
                                    <motion.linearGradient gradientUnits="userSpaceOnUse" animate={{gradientTransform: ["rotate(0, 40, 40)", "rotate(360, 40, 40)"]}} transition={{duration: 5, repeat: Infinity, ease: "linear"}} id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#ff0000ff"/>
                                        <stop offset="50%" stopColor="#0026ffff"/>
                                        <stop offset="100%" stopColor="#eeff00ff"/>
                                    </motion.linearGradient>
                                </defs>

                                <HatGlasses stroke="url(#grad)" onClick={() => {setIsPosting(true); setShouldPost(false)}} size={75} strokeWidth={1.5}/>
                            </svg>
                        <h1 className="text-lg">Touch the icon and you'll be heard</h1>
                    </div>
                </div>}
            </div>
        </>
    );
};