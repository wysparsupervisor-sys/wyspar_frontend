import { PlayCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Last({state}){
    const { current, setCurrent } = state;
    const [isHidden, setIsHidden] = useState(current !== 8);

    useEffect(() => {
        if(isHidden) setIsHidden(current !== 8);
    }, [current]);
    return (
        <div className={`z-2 top-0  max-w-[95%] left-0 fixed w-full h-full flex flex-col gap-5 pl-5 justify-center items-center transition-all ${isHidden ? "opacity-0 pointer-events-none":"opacity-100"}`} style={{transitionDuration: "4s"}}>
            <b className="text-xl text-center flex flex-row items-center gap-3 text-center p-0.5">Join The Fun</b>
            <Image src="/logo.png" alt="logo" height={150} width={150}  className="rounded-lg"/>
            <div className="flex flex-row items-center gap-2 w-[80%]">
                <Link href="/signup" className="w-full border-2 text-center p-1 rounded">SignUp</Link>
                <Link href="/login" className="w-full border-2 text-center p-1 rounded">Login</Link>
            </div>
        </div>
    );
}6