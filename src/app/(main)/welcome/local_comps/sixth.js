import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function Sixth({state}){
    const { current } = state;
    const [isHidden, setIsHidden] = useState(current !== 7);

    useEffect(() => {
        setIsHidden(current !== 7);
    }, [current]);
    return (
        <div className={`z-2 top-0  max-w-[95%] left-0 fixed w-full h-full flex flex-col gap-9 pl-5 justify-center transition-all ${isHidden ? "opacity-0 pointer-events-none":"opacity-100"}`} style={{transitionDuration: "4s"}}>
            <b className="text-3xl flex flex-row items-center gap-3"><Sparkles size={40} strokeWidth={2}/>Build Wyspar</b>
            <div className="bg-[rgb(10,10,10)] rounded-lg text-sm max-w-85 p-3 border-l-3 border-red-600" style={{boxShadow: "inset 10px 10px 20px black", lineHeight: 1.5}}>
                Be part of the community and <b>Keep the vibe growing 🔥⚡</b> A single bottle 🥤 of Pepsi a <b>Month</b> helps us <b>build new features </b> 
                for you✨. Guess what? We're cooking up something wild called <b>Ultravirtual...👀</b> it's going to <b>flip the game 🔥</b> And you <b>don't have to buy us a bottle for the first 20 days. Just dive and vibe!😎👑</b>
            </div>
        </div>
    );
}6