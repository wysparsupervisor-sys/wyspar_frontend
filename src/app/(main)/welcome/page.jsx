"use client";
import { useRef, useState } from "react";
import BubblesBackground from "../../components/animated_backgrounds/bubbles";
import StartButton from "./local_comps/start";
import First from "./local_comps/first";
import Second from "./local_comps/second";
import Third from "./local_comps/third";
import Fourth from "./local_comps/fourth";
import Fifth from "./local_comps/fifth";
import Sixth from "./local_comps/sixth";
import Last from "./local_comps/last";

export default function Welcome(){
    const audioRef = useRef(null);
    const [current, setCurrent] = useState(1);
    
    const BeginIntervel = () => {
        if (current === 1) setCurrent(prev => prev + 1);
        setInterval(() => {
            if(current === 8) return;
            setCurrent(prev => prev + 1)
        }, 10000);
    };

    return (
        <div className="h-full">
            <audio ref={audioRef} src="/welcome.mp3"/>
            <BubblesBackground/>
            <div className="relative overflow-x-hidden h-full">
                <StartButton begin={BeginIntervel} play={audioRef} state={{current, setCurrent}}/>
                <First state={{current, setCurrent}}/>
                <Second state={{current}}/>
                <Third state={{current}}/>
                <Fourth state={{current}}/>
                <Fifth state={{current}}/>
                <Sixth state={{current}}/>
                <Last state={{current, setCurrent}}/>
            </div>
        </div>
    );
};