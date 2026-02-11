import { ArrowLeft, Building, User2  } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createAvatar } from "@dicebear/core";
import * as Collection from "@dicebear/collection";
import { useViewerStore } from "../stores/viewer";
import Link from "next/link";
import ProfileBackground from "../miscellenious/profile-bg";
import { useRouter } from "next/navigation";
import ClickEffect from "@/app/components/effects/click-effect";


export default function Section1(){
    const router = useRouter();
    const profile = useViewerStore((state) => state.profile);
    const [dataUri, setDataUri] = useState("/logo.png");
    
    useEffect(() => {
        const avatar = createAvatar(Collection[profile.details.avatar.style], { seed: profile.details.avatar.seed });
        setDataUri(avatar.toDataUri());
    }, [profile]);

    const handleBack = () => {
        if(window.history.length > 1){
            router.back();
        } else {
            router.push("/me/profile");
        };
    };

    return (
        <>
            <div className="absolute top-0 left-0 h-[50px] w-full bg-black z-1 border-b border-gray-900 flex flex-row items-center pl-3 gap-3"><div><ClickEffect><ArrowLeft onClick={handleBack} size={30}/></ClickEffect></div> Wysparer's profile</div>
            <div className="relative w-full bg-black overflow-hidden">
                <div className="w-full h-[50px]"></div> {/**coompensate for space taken up by header] */}
                <div className="relative w-full" style={{aspectRatio:"7/3"}}></div>
                <ProfileBackground/>
            </div>
            <div className="flex flex-row relative ml-[5%]">
                <div className="relative -mt-[22%] bg-black rounded-full p-1">
                    <Image src={dataUri} width={130} height={130} alt="profile pic" className="bg-white/80 rounded-full"/>
                </div>
                <div className="flex flex-col text-sm mt-1.5">
                    <span className="text-lg mr-[5%]"><b className="text-gray-500">@</b>{profile.anonymous_name}</span>
                    <div className="flex flex-row items-center gap-3 text-gray-500">
                        <div className="flex flex-row items-center gap-1"><User2 color="orangered"/>{profile.gender === 1 ? "Female":"Male"}</div>
                        <div className="flex flex-row items-center gap-1"><Building color="yellow" size={20}/>{profile.school.toUpperCase()}</div>
                    </div>
                </div>
            </div>
        </>
    );
};