"use client";
import { useState } from "react";
import StarsBackground from "../../components/animated_backgrounds/links";
import Email from "./local_comps/email";
import OTP from "./local_comps/otp";
import Password from "./local_comps/password";

export default function Recovery(){
    const [currentSection, setCurrentSection] = useState(0);
    return (
        <div className="h-full flex flex-col items-center justify-center gap-8">
            <StarsBackground/>
            <div className="w-2xs flex flex-col bg-black border border-gray-900 items-center rounded-xl p-6 pt-10 pb-8 gap-5">
                {currentSection===0 && <Email setCurrentSection={setCurrentSection}/>}
                {currentSection===1 && <OTP setCurrentSection={setCurrentSection}/>}
                {currentSection===2 && <Password/>}
            </div>
        </div>
    );
};