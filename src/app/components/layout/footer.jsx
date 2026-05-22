"use client";
import { useAnimation, motion } from "framer-motion";
import { MessagesSquare, Search, Settings, Sparkles, Telescope, UserRound, UserSearch, UsersRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";



function FooterElement({text="", Icon, id="", route="", activeId, setActiveId}){
    const controls1 = useAnimation();
    const controls2 = useAnimation();
    const isActive = id === activeId;

    useEffect(() => {
        controls1.start({
            y: isActive ? "-10px": "0px",
            border: isActive? "1px solid #0a64644f": "none",
            background: isActive? "rgba(0,0,39,1)": "none",
            transition: {duration: .35},
        });
        controls2.start({
            borderBottom: isActive ? "2px solid #5a0019ff":"2px",
        });
    }, [isActive]);

    return(
        <motion.div className="w-[19%]" onClick={() => setActiveId(id)} initial={{borderBottom: "2px"}} animate={controls2}>
            <motion.div className="flex flex-col items-center gap-1 p-0.5 rounded-2xl" initial={{y:0, border: "1px solid rgba(10,10,40,0)", background: "none"}} animate={controls1}>
                <Link href={route} className="flex flex-col items-center">
                    <Icon strokeWidth={1.6} color="#ffffffff"/>
                    <b className="font-medium text-xs">{text}</b>
                </Link>
            </motion.div>
        </motion.div>
    );
};



export default function Footer({className}){
    const [activeId, setActiveId] = useState();
    const currentRoute = usePathname();
    
    useEffect(() => {
        if(currentRoute === "/explore") setActiveId("a");
        if(currentRoute === "/me/profile") setActiveId("b");
        if(currentRoute === "/search") setActiveId("c");
        if(currentRoute === "/manage") setActiveId("e");
        if(currentRoute === "/chat") setActiveId("f");
    },[]);
    
    
    return (
        <div className={`fixed h-[50px] w-full bottom-0 pl-3 pr-3 bg-black flex flex-row items-center justify-between border-t-2 border-gray-900 ${className}`}>
            <FooterElement route="/explore" Icon={Sparkles} text="Explore" id="a" activeId={activeId} setActiveId={setActiveId}/>
            <FooterElement route="/search" Icon={Search} text="Search" id="c" activeId={activeId} setActiveId={setActiveId}/>
            <FooterElement route="/me/profile" Icon={UserRound} text="Profile" id="b" activeId={activeId} setActiveId={setActiveId}/>
            <FooterElement route="/connect" Icon={UsersRound} text="Connect" id="f" activeId={activeId} setActiveId={setActiveId}/>
            <FooterElement route="/manage" Icon={Settings} text="Manage" id="e" activeId={activeId} setActiveId={setActiveId}/>
        </div>
    );
};