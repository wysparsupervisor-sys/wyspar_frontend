import { BarChart3, Feather, FlagTriangleRight, Heart, X } from "lucide-react";
import dynamic from "next/dynamic";
import { UserRoundSearch } from "lucide-react";
import { useState } from "react";
import { GridLoader } from "react-spinners";
import { useUserStore } from "../stores/user";
import millify from "millify";
import { motion } from "framer-motion";
import Section5 from "./section5";
const BioEdit = dynamic(() => import("../editables/bio"), { loading: () => <GridLoader color="white" size={40}/>, ssr: false });

export default function Section2(){
    const showing = useUserStore((state) => state.showing);
    const setShowing = useUserStore((state) => state.setShowing);
    const profile = useUserStore((state) => state.profile);
    const [isEditingBio, setIsEditingBio] = useState(false);

    return (
        <>
            <div className="flex flex-row justify-around text-sm text-gray-400 mt-2 pl-2 pr-2">                
                <p className="flex flex-row items-center gap-1"><BarChart3 size={20}/>{millify(profile.stats.posts, {precision: 1})}</p>
                <p className="flex flex-row items-center gap-1"><FlagTriangleRight size={20}/>{millify(profile.stats.upvotes, {precision: 1})}</p>
                <p className="flex flex-row items-center gap-1"><Heart size={20}/>{millify(profile.stats.likes, {precision: 1})}</p>
            </div>
            <div className="p-2 relative">
                <p className="text-gray-300 bg-black text-sm p-3 rounded-xl">{profile.details.description}</p>
                <div className="absolute right-2 bottom-1 bg-gray-900 p-2 rounded-full"><Feather onClick={() => setIsEditingBio(true)}/></div>
            </div>
            {isEditingBio && <div className="flex flex-row items-center justify-center h-full w-full top-0 fixed bg-black/90 z-1">
                <X className="absolute top-3 left-5" strokeWidth={1} size={40} onClick={() => setIsEditingBio(false)}/>
                <BioEdit/>
            </div>}
            <div className="flex flex-row p-2 text-sm gap-3 pt-0 justify-center items-center text-white">
                <div className="w-full h-[2px] bg-[#5a0019ff] overflow-hidden">
                    <motion.div className="w-full h-full bg-gradient-to-r from-transparent via-red-500 to-transparent" animate={{x: ["-150%", "70%"]}} transition={{repeat: 10, repeatType: "loop", duration: 1, ease: "easeIn"}}></motion.div>
                </div>
                <div onClick={() => setShowing("connect")} className="border-2 rounded-full p-2"><UserRoundSearch strokeWidth={2.5} size={20}/></div>
                <div className="w-full h-[2px] bg-[#0a6464ff] overflow-hidden">
                    <motion.div className="w-full h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent" animate={{x: ["70%", "-150%"]}} transition={{repeat: 10, repeatType: "loop", duration: 1, ease: "easeIn"}}></motion.div>
                </div>
            </div>


            {showing && <div className="fixed w-screen h-screen bg-black top-0 left-0 z-2">
                <Section5/>
            </div>}
        </>
    );
};