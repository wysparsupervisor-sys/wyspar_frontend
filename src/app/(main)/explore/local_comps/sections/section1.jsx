"use client"
import { MapPin, UserSearch } from "lucide-react";
import { useFeedStore } from "../stores/feed";
import { useEffect, useRef } from "react";
import { useScrollStore } from "@/app/(main)/store";
import { useCampusTodayStore } from "../stores/campus-today";

export default function Section1(){
    const changeFeedState = useFeedStore((state) => state.changeFeedState);
    const feedState = useFeedStore((state) => state.feedState);

    const forYouState = useCampusTodayStore((state) => state.forYouState);
    const changeForYouState = useCampusTodayStore((state) => state.changeForYouState);

    const scrollListen = useScrollStore((state) => state.scrollListen);
    
    const hidden = useScrollStore(state => state.hidden);
    const setHidden = useScrollStore(state => state.setHidden);
    const containerRef = useRef(null);
    const lastScroll = useRef(0);
    

    useEffect(() => {
        const el = scrollListen?.current ?? containerRef.current;
        if(!el) return;
        let ticking = false;

        function onScroll(){
            if(!ticking) {
            window.requestAnimationFrame(() => {
                const scrollTop = el.scrollTop;
                const scrollHeight = el.scrollHeight;
                const clientHeight = el.clientHeight;

                const atBottom = scrollTop + clientHeight >= scrollHeight - 2;
                const atTop = scrollTop <= 2;

                if(!atBottom && !atTop) {
                const delta = scrollTop - lastScroll.current;
                if(Math.abs(delta) > 2) {
                    setHidden(delta > 0);
                };
                };

                lastScroll.current = scrollTop;
                ticking = false;
            });
            ticking = true;
            };
        };

        el.addEventListener("scroll", onScroll, { passive: true });
        return () => el.removeEventListener("scroll", onScroll);
    }, [scrollListen]);

    return (
        <div className={`flex flex-col h-[45px] items-center justify-center absolute z-1 w-full bg-black items-center gap-1 justify-between transition-all duration-500 ${hidden ? "mt-[-120px]":"mt-[50px] "}`}>
            {false && <div className="flex flex-row items-center justify-between relative w-full text-sm">
                <div className="flex items-center pl-3">
                    <div onClick={() => changeFeedState("for-you")} className={`flex items-center gap-1 bg-[rgb(6,19,60)] p-1 pl-5 pr-5 rounded-full border-2 transition duration-500 ease-in-out ${feedState === "for-you" ? "scale-100 border-white/80 opacity-100":"scale-80 border-transparent opacity-50"}`}>
                        <span>For You</span>                    
                    </div>
                    {false && <div onClick={() => changeFeedState("near-you")} className={`flex items-center gap-1 bg-[rgb(6,19,60)] p-1 pl-5 pr-5 rounded-full border-2 transition duration-500 ease-in-out ${feedState === "near-you" ? "scale-100 border-white/80 opacity-100":"scale-80 border-transparent opacity-50"}`}>
                        <div className="flex items-center justify-center rounded-full"><MapPin strokeWidth={1.5} size={25}/></div>
                        <span>Near You</span> 
                    </div>}
                </div>
                <div className="pr-3">
                    <div onClick={() => changeFeedState("connect")} className={`p-1.5 border-2 rounded-full transition duration-500 ease-in-out ${feedState === "connect" ? "scale-100 opacity-100":"scale-80 opacity-50"}`}>
                        <UserSearch strokeWidth={2}/>
                    </div>
                </div>
            </div>}
            {feedState === "for-you" && <div className="relative w-full pl-3 pr-3 flex items-center">
                <span onClick={() => changeForYouState("campus-today")} className={`p-1 pr-3 pl-3 border-2 border-blue-800 rounded-2xl bg-[#000030] transition duration-500 ease-in-out ${forYouState === "campus-today" ? "scale-100 opacity-100":"scale-80 opacity-50"}`}>campus today</span>
                <span onClick={() => changeForYouState("campus-space")} className={`p-1 pr-3 pl-3 border-2 border-blue-800 rounded-2xl bg-[#000030] transition duration-500 ease-in-out ${forYouState === "campus-space" ? "scale-100 opacity-100":"scale-80 opacity-50"}`}>campus space</span>
            </div>}
        </div>     
    );
};