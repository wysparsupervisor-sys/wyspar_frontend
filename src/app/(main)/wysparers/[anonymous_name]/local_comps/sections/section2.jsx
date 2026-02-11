import { BarChart3, FlagTriangleRight, Heart } from "lucide-react";
import { useViewerStore } from "../stores/viewer";
import millify from "millify";

export default function Section2(){
    const profile = useViewerStore((state) => state.profile);

    return (
        <>
            <div className="flex flex-row justify-around text-sm text-gray-400 mt-2 pl-2 pr-2">
                <p className="flex flex-row items-center gap-1"><BarChart3 size={20}/>{millify(profile.stats.posts, {precision: 1})}</p>
                <p className="flex flex-row items-center gap-1"><FlagTriangleRight size={20}/>{millify(profile.stats.upvotes, {precision: 1})}</p>
                <p className="flex flex-row items-center gap-1"><Heart size={20}/>{millify(profile.stats.likes, {precision: 1})}</p>
            </div>
            <div className="p-2 relative">
                <p className="text-gray-300 bg-black text-sm p-3 rounded-xl">{profile.details.description}</p>
            </div>
        </>
    );
};