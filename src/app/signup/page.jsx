"use client";
import StarsBackground from "../components/animated_backgrounds/links";
import { useState } from "react";
import dynamic from "next/dynamic";
import { GridLoader } from "react-spinners";
import School from "./local_comps/school";
const AnonymousName = dynamic(() => import("./local_comps/anonymous_name"));
const Gender = dynamic(() => import("./local_comps/gender"), { loading: () => <LoadingAnimation/> });
const Avatar = dynamic(() => import("./local_comps/avatar"), { loading: () => <LoadingAnimation/> });
const Email = dynamic(() => import("./local_comps/email"), { loading: () => <LoadingAnimation/> });
const OTP = dynamic(() => import("./local_comps/otp"), { loading: () => <LoadingAnimation/> })
const Password = dynamic(() => import("./local_comps/password"), { loading: () => <LoadingAnimation/> });


function LoadingAnimation() {
    return <GridLoader color="white" size={30}/>
};


export default function SignUp() {
    const [currentSection, setCurrentSection] = useState(0);
    const [formInfo, setFormInfo] = useState({
        anonymous_name: "",
        gender: null,
        avatar: {
            style: null,
            seed: null,
        },
        email: "",
        school: [],
    });

        
    return (
        <div className="h-full flex flex-col items-center justify-center gap-8">
            <StarsBackground/>
            <div className="w-2xs flex flex-col bg-black border border-gray-900 items-center rounded-xl p-6 pt-10 pb-8 gap-5">
                {currentSection===0 && <School context={{formInfo, setFormInfo}}/>}
                {currentSection===1 && <AnonymousName context={{formInfo, setFormInfo}}/>}
                {currentSection===2 && <Gender context={{formInfo, setFormInfo}}/>}
                {currentSection===3 && <Avatar context={{formInfo, setFormInfo}}/>}
                {currentSection===4 && <Email context={{formInfo, setFormInfo, setCurrentSection}}/>}
                {currentSection===5 && <OTP context={{formInfo, setCurrentSection}}/>}
                {currentSection===6 && <Password/>}
                {currentSection < 4 && <button className="bg-[#5a0019ff] p-2 w-full rounded-sm" onClick={() => setCurrentSection(prev => prev+1)}>Next</button>}
            </div>
            {(currentSection < 5 && currentSection !== 0) && 
            <div className="absolute bottom-0 right-0 left-0 bottom-0">
                <button onClick={() => setCurrentSection(prev => prev-1)} className="border-2 ml-5 mb-5 p-2 pl-8 bg-black pr-8 rounded-sm border border-[#0a6464ff]">Previous</button>
            </div>}
        </div>
    );
};