"use client";
import { useRef, useState } from "react";
import BubblesBackground from "../../components/animated_backgrounds/bubbles";
import StartButton from "./local_comps/start";
import First from "./local_comps/first";

export default function Welcome(){
    const audioRef = useRef(null);
    const [current, setCurrent] = useState(1);

    return (
        <div className="h-full">
            <audio ref={audioRef} src="/welcome.mp3"/>
            <BubblesBackground/>
            <div className="relative overflow-x-hidden h-full">
                <StartButton play={audioRef} state={{current, setCurrent}}/>
                <First state={{current, setCurrent}}/>
            </div>
        </div>
    );
};