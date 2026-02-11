"use client";
import Request from "@/app/lib/utils/request";
import { KeyRound } from "lucide-react";
import { useRef, useState } from "react";
import { ClipLoader } from "react-spinners";

export default function OTP({setCurrentSection}){
    const [response, setResponse] = useState();
    const [loading, setLoading] = useState(false);
    const otpRef = useRef();   

    const SendOTP = async () => {
        const otp = otpRef.current.value;
        if (otp.length !== 8) return setResponse("Must be 6 characters long");
        
        setLoading(true);
        const data = await Request("/auth/recover?action=otp", "POST", { otp: otp }); setLoading(false);
        if (data.ok) return setCurrentSection(prev => prev+1);
        setResponse(data.msg);
    };

    return (
        <>
            <div className="w-full flex flex-row justify-center">
                <KeyRound size={60} className="text-gray-500"/>
            </div>
            {response ? <p className="text-sm text-[orangered]" style={{lineHeight: "1.3"}}>{response}</p> : <p className="text-sm text-gray-400" style={{lineHeight: "1.3"}}>Enter the code sent to your email address</p>}
            <input ref={otpRef} type="text" maxLength="8" inputMode="numeric" className="outline-none tracking-widest w-full min-w-0 w-full text-center text-lg bg-[rgb(30,30,30)] rounded-sm p-2" placeholder="Code" onInput={
                (e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                }
            }/>
            <div className="bg-[#5a0019ff] w-full p-2 flex flex-col items-center rounded-sm">
                {loading ? <ClipLoader color="white" size={24}/>:<button className="w-full h-full" onClick={SendOTP}>Next</button>}
            </div>
        </>
    );
};