"use client";
import Request from "@/app/lib/utils/request";
import { Mail, Mailbox } from "lucide-react";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { z } from "zod";

export default function Email({setCurrentSection}){
    const [response, setResponse] = useState();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");

    const sendEmail = async () => {
        setResponse("");
        if(!z.string().email().safeParse(email).success) return setResponse("Enter a valid email address");

        setLoading(true);
        const res = await Request("/auth/recover?action=email", "POST", { email: email });
        setLoading(false); setResponse(res.msg);
        if (res.ok) setCurrentSection(prev => prev + 1);
    };

    return (
        <>
            <Mail color="orange" size={50}/>
            {response ? <p className="text-sm text-[orangered]" style={{lineHeight: "1.3"}}>{response}</p> : <p className="text-sm" style={{lineHeight: "1.3"}}>Enter the email address associated with your forgotten account.</p>}
            <div className="w-full bg-[rgb(30,30,30)] rounded-sm p-2 flex flex-row items-center">
                <input type="email" onInput={(e) => { e.target.value = e.target.value.replace(/\s/g, '') }} onChange={(e) => setEmail(e.target.value)} className="outline-none w-full min-w-0" placeholder="Email address"/>
                <Mailbox color="white" strokeWidth="1.6" size={30}/>
            </div>
            <div className="bg-[#5a0019ff] w-full p-2 flex flex-col items-center rounded-sm">
                {loading ? <ClipLoader color="white" size={24}/>:<button className="w-full h-full" onClick={sendEmail}>Next</button>}
            </div>
        </>
    )
}