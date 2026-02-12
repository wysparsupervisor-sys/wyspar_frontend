import { useEffect, useState } from "react";

export default function First({play, state}){
    const { current, setCurrent } = state;
    const [isHidden, setIsHidden] = useState(current !== 2);

    useEffect(() => {
        setIsHidden(current !== 2);
    }, [current]);
    return (
        <div className={`z-2 top-0 left-0 fixed w-full h-full flex flex-col gap-8 pl-5 justify-center transition-all ${isHidden ? "opacity-0 pointer-events-none":"opacity-100"}`} style={{transitionDuration: "4s"}}>
            <b className="text-3xl">Welcome To Wyspar!</b>
            <div className="bg-[rgb(10,10,10)] rounded-lg text-sm max-w-85 p-3 border-l-3 border-red-600" style={{boxShadow: "inset 10px 10px 20px black", lineHeight: 1.5}}>
                🚀Imagine a social media app <b>just for campus students! 👩‍🎓</b> Anonymous 🎭 Location-based 🌎 Category-Focused ⚡ Super interactive 👑 Say whatever's on your mind <b>without anyone knowing it's you 😎</b>
                Freedom to speak, connect, and explore like never before... Isn't that Epic??! 
            </div>
            <div className="flex flex-wrap gap-3 items-center text-sm">
                <div className="flex-shrink-0 border-2 border-[yellow] pl-4 pr-4 rounded-full">campus</div>
                <div className="flex-shrink-0 border-2 border-[#000090] pl-4 pr-4 rounded-full">anonymous</div>
                <div className="flex-shrink-0 border-2 border-red-600 pl-4 pr-4 rounded-full">location-based</div>
                <div className="flex-shrink-0 border-2 border-[greenyellow] pl-4 pr-4 rounded-full">category-rich</div>
                <div className="flex-shrink-0 border-2 pl-4 pr-4 rounded-full">higly-interactive</div>
            </div>
        </div>
    );
}