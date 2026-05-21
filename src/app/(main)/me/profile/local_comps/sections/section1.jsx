import { Building, Camera, User2, X } from "lucide-react";
import Image from "next/image";
import * as Collection from "@dicebear/collection";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { GridLoader } from "react-spinners";
import ProfileBackground from "@/app/(main)/me/profile/local_comps/miscellenious/profile-bg";
import { useUserStore } from "../stores/user";
import { MEDIA_GET_URL } from "../../../../../../../domain";
import { GetFromLocalStorage } from "@/app/lib/utils/local-storage";
import { createAvatar } from "@dicebear/core";
const AvatarEdit = dynamic(() => import("../editables/avatar"), { loading: () => <GridLoader color="white" size={40}/>, ssr: false });


export default function Section1(){
    const profile = useUserStore((state) => state.profile);
    const [dataUri, setDataUri] = useState("/logo.png");
    const [isEditingAvatar, setIsEditingAvatar] = useState(false);
    

    useEffect(() => {
        const avatar = createAvatar(Collection[profile.details.avatar.style], { seed: profile.details.avatar.seed });
        
        if (profile.details.profile_photo) {
            setDataUri(`${MEDIA_GET_URL}/${profile.details.profile_photo}_240.webp?v=${GetFromLocalStorage("cache_query_hack")}`)
        } else {
            setDataUri(avatar.toDataUri());    
        };        
    }, [profile]);

    return (
        <>
            <div className="relative w-full bg-black overflow-hidden">
                <div className="w-full h-[55px]"></div> {/**coompensate for space taken up by header] */}
                <div className="relative w-full" style={{aspectRatio:"7/3"}}></div>
                <ProfileBackground/>
            </div>
            <div className="flex flex-row relative ml-[5%]">
                <div className="relative -mt-[22%] bg-black rounded-full p-1">
                    <Image src={dataUri} width={130} height={130} alt="profile pic" className="bg-white/80 rounded-full"/>
                    <div className="absolute right-[5%] bottom-[3%] bg-[#0a6464ff] rounded-full p-2 border border-gray-900" onClick={() => setIsEditingAvatar(true)}><Camera/></div>
                </div>
                <div className="flex flex-col text-sm mt-1.5">
                    <span className="text-lg mr-[5%]"><b className="text-gray-500">@</b>{profile.anonymous_name}</span>
                    <div className="flex flex-row items-center gap-3 text-gray-500">
                        <div className="flex flex-row items-center gap-1"><User2 color="orangered"/>{profile.gender === 1 ? "Female":"Male"}</div>
                        <div className="flex flex-row items-center gap-1"><Building color="yellow" size={20}/>{profile.school.toUpperCase()}</div>
                    </div>
                </div>
            </div>
            {isEditingAvatar && <div className="flex flex-row items-center justify-center h-full w-full top-0 fixed bg-black/90 z-1">
                <X className="absolute top-3 left-5" strokeWidth={1} size={40} onClick={() => setIsEditingAvatar(false)}/>
                <AvatarEdit/>
            </div>}
        </>
    );
};