import TimeAgo from "@/app/lib/utils/time-ago";
import { createAvatar } from "@dicebear/core";
import { ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import * as Collection from "@dicebear/collection";
import Menu from "../miscellanious/menu";
import Link from "next/link";
import { FRONTEND_URL, MEDIA_GET_URL } from "../../../../../../../../../../../domain";


export default function Section1({info, store}){
    const [dataUri, setDataUri] = useState("/logo.png");
    const [menuIsVisible, setMenuIsVisible] = useState(false);
    const { avatar, anonymous_name, school, created_at } = info;

    useEffect(() => {
        const ava = createAvatar(Collection[avatar.style], { seed: avatar.seed });
        setDataUri(info.profile_photo ? `${MEDIA_GET_URL}/${info.profile_photo}_240.webp` : ava.toDataUri());
    }, []);
    
    return (
        <div className="relative">
            <div className="relative flex flex-row gap-1 items-center justify-between">
                <div className="flex flex-row items-center gap-2 flex-shrink-0">
                    <Image src={dataUri} width={45} height={50} alt="profile avatar" className="rounded-full bg-white/60"/>
                    <div className="flex flex-col">
                        <Link className="rounded-full focus:outline-auto" href={FRONTEND_URL + "/wysparers/" + encodeURIComponent(anonymous_name)}><b><b className="text-gray-400 text-xl">@</b>{anonymous_name}</b></Link>
                        <div className="flex flex-row gap-2 text-xs text-gray-400"><b>{school.toUpperCase()}</b><span className="text-gray-300">{TimeAgo(created_at)}</span></div>
                    </div>
                </div>
                {menuIsVisible ? <ChevronUp size={30} onClick={() => setMenuIsVisible(!menuIsVisible)}/>:<ChevronDown size={30} onClick={() => setMenuIsVisible(!menuIsVisible)}/>}
            </div>
            <Menu info={info} className={`transition-all duration-500 ${menuIsVisible ? "opacity-100 pointer-events-auto":"opacity-0 pointer-events-none"}`}/>
        </div>
    );
};