import { BarChart3, Feather, FlagTriangleRight, Heart, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { GridLoader } from "react-spinners";
import { useUserStore } from "../stores/user";
import millify from "millify";
const BioEdit = dynamic(() => import("../editables/bio"), { loading: () => <GridLoader color="white" size={40}/>, ssr: false });

export default function Section2(){
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
        </>
    );
};