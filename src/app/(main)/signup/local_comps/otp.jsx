import Request from "@/app/lib/utils/request";
import { KeyRound } from "lucide-react";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
 
export default function OTP({context}) {
    const { setCurrentSection, formInfo } = context;
    const [response, setResponse] = useState();
    const [loading, setLoading] = useState(false); 
    const [loading1, setLoading1] = useState(false); 
    const [timeRemaining, setTimeRemaining] = useState(120);
    const otpRef = useRef();    
    
    const SendOTP = async () => {
        const otp = otpRef.current.value;
        if (otp.length !== 6) return setResponse("Must be 6 characters long");
        
        setLoading(true);
        const data = await Request("/auth/signup?payload=otp", "POST", { otp: otp }); setLoading(false);
        if (data.ok) return setCurrentSection(prev => prev+1);
        setResponse(data.msg);
    };

    const ResendOTP = async () => {
        if (timeRemaining > 0) return;
        setLoading1(true); setResponse("");
        const res = await Request("/auth/signup?payload=resend-otp", "POST");
        if(!res.ok) setTimeRemaining(0);
        setTimeRemaining(120);
        setResponse(res.msg);
        setLoading1(false);
    };

    useEffect(() => {
        setInterval(() => {
            if (timeRemaining === 0) return;
            setTimeRemaining(prev => prev - 1);
        }, 1000);
    }, []);

    return (
        <div>
            <div className="w-full flex flex-row justify-center mb-4">
                <KeyRound size={60} className="text-gray-500"/>
            </div>
            {response ? <p className="text-sm text-[orangered]" style={{lineHeight: "1.3"}}>{response}</p> : <p className="text-sm text-gray-400" style={{lineHeight: "1.3"}}>Enter the code sent to your email address <b className="text-white">({formInfo.email})</b>(If you didn't find it try checking your spam folder.)</p>}
            <input ref={otpRef} type="text" maxLength="6" inputMode="numeric" className="mt-3 outline-none tracking-widest w-full min-w-0 w-full text-center text-lg bg-[rgb(30,30,30)] rounded-sm p-2" placeholder="Code" onInput={
                (e) => {
                    e.target.value = e.target.value.replace(/\D/g, "");
                }
            }/>
            <div className="bg-[#5a0019ff] mt-2 w-full p-2 flex flex-col items-center rounded-sm">
                {loading ? <ClipLoader color="white" size={24}/>:<button className="w-full h-full" onClick={SendOTP}>Next</button>}
            </div>
            {timeRemaining > 0 && <div className="text-center text-sm mt-5">Wait {timeRemaining} seconds to resend</div>}
            <div className="border-1 border-[#0a6464ff] mt-1 -mb-4 w-full p-1 flex flex-col items-center rounded-sm" style={{opacity: timeRemaining > 0 ? 0.5: 1}}>
                {loading1 ? <ClipLoader color="white" size={24}/>:<button className="w-full h-full text-sm" onClick={ResendOTP}>Resend code</button>}
            </div>
        </div>
    );
};