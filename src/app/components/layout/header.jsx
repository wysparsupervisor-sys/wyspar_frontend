"use client";
import { APP_NAME } from "@/app/lib/data/app-name";
import { Telescope, UserRoundPlus } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ClickEffect from "../effects/click-effect";
import Link from "next/link";
import { FRONTEND_URL } from "../../../../domain";


export default function Header({className , ...props}){
    const pathname = usePathname();
    const shareWyspar = async () => {
        await navigator.share({
            url: FRONTEND_URL,
            title: "Join Wyspar now!"
        })
    }
    return (
        <div className={`fixed h-[55px] top-0 w-full bg-black flex ${pathname !== "/explore" && "border-b border-gray-900"} flex-row items-center justify-between pl-2 pr-2 left-0 ${className}`} {...props}>
            <div className="flex flex-row items-center gap-1">
                <Image src="/logo.png" height={47} width={47} alt="logo" className="rounded-full"/><b className="text-lg">{APP_NAME}</b>
            </div>
            <div className="pr-1">
                {pathname === "/me/profile" && <UserRoundPlus onClick={shareWyspar}/>}
                {pathname === "/explore" && <ClickEffect><Link href="/search"><Telescope strokeWidth={3}/></Link></ClickEffect>}
            </div>
        </div>
    );
};