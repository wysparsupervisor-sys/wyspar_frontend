import { ChevronDown, Feather, HatGlasses, MessageCircleQuestion } from "lucide-react";  
import { useState } from "react";
import dynamic from "next/dynamic";
import { ClockLoader } from "react-spinners";
import StarsBackground from "../animated_backgrounds/stars";
const MakePost = dynamic(() => import("../workshop/post"), { loading: () => <LoadingAnimation/>});
const MakeFeedback = dynamic(() => import( "../workshop/feedback"), { loading: () => <LoadingAnimation/>});


function LoadingAnimation(){
    return (
        <div className="w-full bg-black h-full absolute z-2 flex flex-col items-center justify-center">
            <StarsBackground/>
            <ClockLoader color="white" size={100}/>
        </div>
    );
};


export default function Tools({className}){
    const [isOpen, setIsOpen] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [isFeedbacking, setIsFeedbacking] = useState(false);

    return(
        <>
            <div className={`flex flex-col items-right justify-right gap-2 text-3xl fixed bottom-20 right-5 z-2 ${className}`}>            
                {isOpen && <div className="flex flex-row gap-3">
                    <div onClick={() => setIsPosting(true)} className="bg-[#000030] rounded-full p-2 border border-gray-700"><Feather/></div>
                    <div onClick={() => setIsFeedbacking(true)} className="bg-[#0a6464ff] rounded-full p-2 border border-gray-700"><MessageCircleQuestion/></div>
                </div>}
                <div className="bg-[#5a0019ff] flex-grow-0 flex flex-row justify-center rounded-full p-3 border border-gray-900" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <ChevronDown size={30}/>:<HatGlasses size={30}/>}
                </div>
            </div>
            {isPosting && <>
                <MakePost pageIsOPen={setIsPosting}/>
            </>}
            {isFeedbacking && <MakeFeedback pageIsOpen={setIsFeedbacking}/>}
        </>
    );
};