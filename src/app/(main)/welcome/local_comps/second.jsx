import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Second({state}){
    const { current } = state;
    const [isHidden, setIsHidden] = useState(current !== 3);

    useEffect(() => {
        setIsHidden(current !== 3);
    }, [current]);
    return (
        <div className={`z-2 top-0  max-w-[95%] left-0 fixed w-full h-full flex flex-col gap-8 pl-5 justify-center transition-all ${isHidden ? "opacity-0 pointer-events-none":"opacity-100"}`} style={{transitionDuration: "4s"}}>
            <b className="text-3xl flex flex-row items-center gap-3">Campus Based <Building2/></b>
            <div className="bg-[rgb(10,10,10)] rounded-lg text-sm max-w-85 p-3 border-l-3 border-red-600" style={{boxShadow: "inset 10px 10px 20px black", lineHeight: 1.5}}>
                💥🏆<b>Wyspar is made for students like YOU! 👩‍🎓</b> Everything you see is <b>all about your campus.</b> 
                The vibes, the energy, the gossip ✨ And guess what? It <b>needs people like YOU</b> to make it even richer, wilder, and way more fun 💥🙌
            </div>
            <div className="flex flex-wrap gap-2 items-center text-sm">
                <div className="flex-shrink-0 border-2 border-[greenyellow] pl-4 pr-4 rounded-full">futo</div>
                <div className="flex-shrink-0 border-2 border-[orange] pl-4 pr-4 rounded-full">imsu</div>
                <div className="flex-shrink-0 border-2 border-[red] pl-4 pr-4 rounded-full">unipoly</div>
                <div className="flex-shrink-0 border-2 border-gray-500 pl-4 pr-4 rounded-full">more...</div>
            </div>
        </div>
    );
};