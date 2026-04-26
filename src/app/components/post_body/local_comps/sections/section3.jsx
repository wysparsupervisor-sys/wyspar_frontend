import { POST_CATEGORIES, POST_CATEGORIES_ICONS } from "@/app/lib/data/post-categories";
import { LOCATION_CLASSES } from "@/app/lib/data/location-classes";
import { MapPin } from "lucide-react";
import Image from "next/image";

export default function Section3({info}){
    const { post_category, location_status } = info;
    const Icon = POST_CATEGORIES_ICONS[POST_CATEGORIES[post_category]];

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-row text-sm items-center text-gray-400 gap-2">
                <div className={`flex flex-row items-center gap-1 border ${location_status == 0 && "border-green-600/70"} ${location_status == 1 && "border-[orange]/50"} ${location_status == 2 && "border-red-700/50"} ${location_status == 3 && "border-gray-700"} pl-3 pr-3 rounded-full`}><MapPin size={17} color="red"/>{LOCATION_CLASSES[location_status]}</div>
                <div className="flex flex-row items-center gap-1"><Icon.icon size={17} color={Icon.color}/>{POST_CATEGORIES[post_category]}</div>
            </div>
            <div className="flex flex-row items-center text-gray-300">
                <Image src="/icon-192.png" height={25} width={25} alt="wyspar logo"/>
                <span>wyspar.com</span>
            </div>
        </div>
    );
};