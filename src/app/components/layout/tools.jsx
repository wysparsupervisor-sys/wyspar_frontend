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
import SelectWhatToPost from "../workshop/select/select";
import IAmLookingForSomeone from "../workshop/connect";
import Swap from "../workshop/swap";


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
    const [action, setAction] = useState((searchParams.get("isposting") === "true" && "post"));
    const [isFeedbacking, setIsFeedbacking] = useState(false);

    return(
        <>
            <div className={`flex flex-col items-right justify-right gap-2 text-3xl fixed bottom-20 right-5 z-2 ${className}`}>            
                <div className="bg-[#000099] flex-grow-0 flex flex-row justify-center rounded-full p-3 border-1 border-white" onClick={() => setAction("select")}>
                    {isOpen ? <ChevronDown size={30}/>:<Plus size={30} strokeWidth={3}/>}
                </div>
            </div>
            {action === "select" && <SelectWhatToPost setAction={setAction}/>}
            {action === "post" && <>
                <MakePost setAction={setAction}/>
            </>}
            {action === "look" && <IAmLookingForSomeone setAction={setAction}/>}
            {action === "swap" && <Swap setAction={setAction}/>}
            {isFeedbacking && <MakeFeedback pageIsOpen={setIsFeedbacking}/>}
        </>
    );
};