import { useEffect, useRef, useState } from "react";
import Section1C from "./sections/section1c";
import Section2C from "./sections/section2c";
import Section3C from "./sections/section3c";
import { usePostViewContext } from "../../context";
import ClickEffect from "@/app/components/effects/click-effect";
import { ArrowLeft } from "lucide-react";
import { produce } from "immer";



export default function Comments({info}){
    const {_, setPostStates }  = usePostViewContext();
    const [hidden, setHidden] = useState(false);
    const containerRef = useRef(null);
    const lastScroll = useRef(0);

    useEffect(() => {
        const el = containerRef.current;
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
    }, []);
    

    return (
        <div className="fixed z-2 w-full h-[100dvh] left-0 top-0 bg-black">
            <div ref={containerRef} className="flex flex-col gap-2 w-full h-full overflow-y-scroll">
                <div className={`fixed flex flex-row items-center gap-2 h-[50px] pl-2 border-b border-gray-900 w-full top-0 left-0 bg-black z-1 flex-row items-center transition-all duration-500 ${hidden ? "top-[-50px]":"top-0"}`}>
                    <div>
                        <ClickEffect><ArrowLeft onClick={() => setPostStates(c => produce(c, draft => { draft.isCommenting = false }))} strokeWidth={1.6} size={30}/></ClickEffect>
                    </div>
                    <div className="flex-grow-1 w-full text-gray-200">Whisper & Ghosts</div>
                </div>
                <Section1C info={info}/>
                <Section2C info={info}/>
                <Section3C info={info} className={`transition-all duration-500 ${hidden ? "bottom-[-90px]":"bottom-0"}`}/>
            </div>
        </div>
    );
};