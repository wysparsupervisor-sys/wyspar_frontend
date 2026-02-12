import { Dot, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function Fifth({state}){
    const { current } = state;
    const [isHidden, setIsHidden] = useState(current !== 6);

    useEffect(() => {
        setIsHidden(current !== 6);
    }, [current]);
    return (
        <div className={`z-2 top-0 left-0 fixed max-w-[95%] w-full h-full flex flex-col gap-9 pl-5 justify-center transition-all ${isHidden ? "opacity-0 pointer-events-none":"opacity-100"}`} style={{transitionDuration: "4s"}}>
            <b className="text-3xl flex flex-row items-center gap-3"><Sparkles size={40} strokeWidth={2}/>Category Rich</b>
            <div className="bg-[rgb(10,10,10)] rounded-lg text-sm max-w-85 p-3 border-l-3 border-red-600" style={{boxShadow: "inset 10px 10px 20px black", lineHeight: 1.5}}>
                Buzz, fun, confession, real talk, advice, rant, or question. <b>Whatever's on your mind, we've got a category for it 🔥⚡</b>
                 Poost freely, stay organized, and let your thoughts shine 💥🏆👩‍🎓
            </div>
            <b className="flex flex-wrap gap-2 items-center pr-3">
                fun😂 <Dot/> realtalk🎤 <Dot/> confession💞 <Dot/> advice🎯 <Dot/> rant💢 <Dot/> academic📕 <Dot/> alot....
            </b>
        </div>
    );
}6