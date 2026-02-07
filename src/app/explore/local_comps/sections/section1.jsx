import { POST_CATEGORIES, POST_CATEGORIES_ICONS } from "@/app/lib/data/post-categories";
import { useFeedStore } from "../stores/feed";
import { Circle } from "lucide-react";

export default function Section1(){
    const updatePostCategory = useFeedStore((state) => state.updatePostCategory);
    const postCategory = useFeedStore((state) => state.postCategory);

    return (
        <>
            <div className="w-full mt-[55px] flex flex-row items-center justify-around gap-3 p-2 pt-0 overflow-x-scroll">
                <p onClick={() => updatePostCategory("all")} className={`flex flex-row items-center gap-2 p-1.5 text-sm bg-gray-900/60 pl-4 pr-4 rounded-xl ${"all" === postCategory && "border-2 border-[#000090]/50"}`}><Circle size={20}/> all</p>
                {POST_CATEGORIES.map((val, i) => {
                    const Icon = POST_CATEGORIES_ICONS[val].icon;
                    return (<p key={i} onClick={() => updatePostCategory(val)} className={`flex flex-row items-center gap-2 p-1.5 text-sm bg-gray-900/60 pl-4 pr-4 rounded-xl ${val === postCategory && "border-2 border-[#000090]/50"}`}><Icon size={20} color={POST_CATEGORIES_ICONS[val].color}/>{val}</p>)
                })}
            </div>
        </>
    );
};