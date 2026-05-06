"use client";
import { Lock, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { APP_NAME } from "../../lib/data/app-name";
import { useRef, useState } from "react";
import { z } from "zod";
import Request from "../../lib/utils/request";
import { ClipLoader } from "react-spinners";
import { redirect } from "next/navigation";
import StarsBackground2 from "@/app/components/animated_backgrounds/stars2";
import { SaveToLocalStorage } from "@/app/lib/utils/local-storage";


export default function Login() {
    const [response, setResponse] = useState();
    const [loading, setLoading] = useState(false);
    const passwordRef = useRef();
    const emailRef = useRef();

    const emailSchema = z.string().email("Incorrect email or password!");
    const RequestLogin = async () => {
        const password = passwordRef.current.value;
        const email = emailRef.current.value;

        const emailValRes = emailSchema.safeParse(email);
        if(!emailValRes.success) return setResponse(emailValRes.error.issues[0].message);
        if(!password) return setResponse("Incorrect email or password!");

        setLoading(true); setResponse("");
        const res = await Request("/auth/login", "POST", { email: email, password: password });
        setLoading(false); setResponse(res.msg);
        SaveToLocalStorage("connect-block", "active", 1000 * 60 * 60 * 24 * 365);
        if(res.ok) redirect("/explore");
    };

    return (
        <div className="h-full flex flex-col items-center justify-center gap-8">
            <StarsBackground2/>
            <h1 className="text-3xl">Welcome to {APP_NAME}</h1>
            <div className="w-2xs flex bg-black flex-col items-center gap-10 rounded-xl p-6 pt-5 pb-8 border-2 border-gray-white">
                <p className="text-2xl flex -mb-6 flex-row items-center justify-center gap-3"><Image src="/logo.png" alt="logo" width={80} height={80} className="rounded-full"/>Login</p>
                <div className="flex flex-col gap-2">
                    {response && <p className="text-sm text-center text-[orangered]">{response}</p>}
                    <div className="w-full bg-[rgb(30,30,30)] rounded-sm p-2 flex flex-row items-center">
                        <input ref={emailRef} className="outline-none w-full min-w-0" placeholder="Email"/>
                        <Mail strokeWidth="1.6"/>
                    </div>
                    <div className="w-full bg-[rgb(30,30,30)] rounded-sm p-2 flex flex-row items-center">
                        <input type="password" ref={passwordRef} className="outline-none w-full min-w-0" placeholder="Password"/>
                        <Lock color="white" strokeWidth="1.6"/>
                    </div>
                </div>
                <div className="w-full flex flex-col items-center gap-2">
                    <div className="bg-[#5a0019ff] w-full p-2 flex flex-col items-center rounded-sm">
                        {loading ? <ClipLoader color="white" size={24}/>:<button className="w-full h-full" onClick={RequestLogin}>SignIn</button>}
                    </div>
                    <Link href="/recover"><p style={{textDecoration: "underline"}}>Forgot password?</p></Link>
                </div>
            </div>
            <div className="flex flex-col bg-black items-center mt-3">
                <Link href="/signup" className="relative border-2 p-2 pl-8 pr-8 rounded-sm border-[#0a6464ff]">Create Account</Link>
            </div>
        </div>
    );
};