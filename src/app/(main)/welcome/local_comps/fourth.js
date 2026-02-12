import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

export default function Fourth({state}){
    const { current } = state;
    const [isHidden, setIsHidden] = useState(current !== 5);

    useEffect(() => {
        setIsHidden(current !== 5);
    }, [current]);
    return (
        <div className={`z-2 top-0 left-0 fixed w-full h-full flex flex-col gap-9 pl-5 justify-center transition-all ${isHidden ? "opacity-0 pointer-events-none":"opacity-100"}`} style={{transitionDuration: "4s"}}>
            <b className="text-3xl flex flex-row items-center gap-3">Location Based <MapPin strokeWidth={2}/></b>
            <div className="bg-[rgb(10,10,10)] rounded-lg text-sm max-w-85 p-3 border-l-3 border-red-600" style={{boxShadow: "inset 10px 10px 20px black", lineHeight: 1.5}}>
                Your posts get tagged based on where you're posting from 🔥 On campus? <b>On Campus 🏙</b> Nearby? <b>Near Campus 📍</b>
                 Somewhere else?? <b>Off Campus 🌎</b> Didn't say or something glitched? <b>Unreliable ☔</b> It's all about keeping
                  your feed real and full of campus vibes 🙌✨
            </div>
            <div className="flex flex-wrap gap-2 items-center text-sm">
                <div className="flex-shrink-0 border-2 border-[greenyellow] pl-4 pr-4 rounded-full">on-campus</div>
                <div className="flex-shrink-0 border-2 border-[orange] pl-4 pr-4 rounded-full">near-campus</div>
                <div className="flex-shrink-0 border-2 border-[red] pl-4 pr-4 rounded-full">off-campus</div>
                <div className="flex-shrink-0 border-2 border-gray-500 pl-4 pr-4 rounded-full">unreliable</div>
            </div>
        </div>
    );
};