"use client";
import Image from "next/image";
import BubblesBackground from "../components/animated_backgrounds/bubbles";
import { Plane } from "lucide-react";

export default function Welcome(){
    return (
        <div className="h-full">
            <BubblesBackground/>
            <div className="flex flex-col gap-3 items-center justify-center h-full">
                <h1 className="text-2xl">Welcome to Wyspar</h1>
                <Image src="/logo.png" alt="logo" height={130} width={130} className="rounded-2xl border-3 border-white"/>
                <p className="w-60 bg-[rgb(12,12,12)] rounded-xl rounded-xl p-3 text-sm" style={{boxShadow: "inset 20px 20px 30px black"}}>A campus platform for highly interactive anonymous free speech!</p>
                <Plane className="mt-5"/>
            </div>
        </div>
    );
};