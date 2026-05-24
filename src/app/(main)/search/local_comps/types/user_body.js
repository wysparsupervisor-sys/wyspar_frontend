import { createAvatar } from "@dicebear/core";
import * as Collection from "@dicebear/collection";
import { BarChart3, GraduationCap, User2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FRONTEND_URL, MEDIA_GET_URL } from "../../../../../../domain";
import ClickEffect from "@/app/components/effects/click-effect";

export default React.memo(function UserSearchResultBody({info}){
    const [dataUri, setDataUri] = useState("/logo.png");
    const { gender, school, posts, anonymous_name, avatar, profile_photo } = info;

    useEffect(() => {
        const ava = createAvatar(Collection[avatar.style], { seed: avatar.seed });
        if(profile_photo) return setDataUri(`${MEDIA_GET_URL}/${profile_photo}_240.webp`)
        setDataUri(ava.toDataUri());
    }, []);

    return (
        <div className="flex flex-row p-2 gap-2 border-b border-gray-900">
            <Image src={dataUri} height={100} width={100} alt="user profile" className="bg-white/95 rounded-2xl"/>
            <div className="flex flex-col gap-1 pt-2 pb-1">
                <span><b>@</b>{anonymous_name}</span>
                <b className="flex flex-row gap-3 text-sm text-gray-300">
                    <b className="flex flex-row items-center gap-1"><GraduationCap color="yellow" size={20}/>{school}</b>
                    <b className="flex flex-row items-center gap-1"><User2 color="orangered" size={20}/>{gender === 0 ? "Male":"Female"}</b> 
                    <b className="flex flex-row items-center gap-1"><BarChart3 color="cyan" size={20}/>{posts}</b>
                </b>
                <ClickEffect p={1.1} className="h-9 flex-grow-1 bg-[#5a0019ff] rounded-lg"><Link className="h-full flex flex-col items-center justify-center " href={FRONTEND_URL + "/wysparers/" + encodeURIComponent(anonymous_name)}>Discover</Link></ClickEffect>
            </div>
        </div>
    );
});