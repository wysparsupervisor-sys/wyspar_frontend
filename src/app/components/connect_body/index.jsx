import { useUserStore } from "@/app/(main)/me/profile/local_comps/stores/user";
import TimeAgo from "@/app/lib/utils/time-ago";
import { AnimatedBackground } from "animated-backgrounds";
import { Clock, Gem, MapPin, Share2, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FindSimilarConnects from "./similar";
import { useState } from "react";
import { GetFromLocalStorage } from "@/app/lib/utils/local-storage";
import { UUIDToBase62 } from "@/app/lib/utils/base-converter";
import { FRONTEND_URL } from "../../../../domain";
import Request from "@/app/lib/utils/request";

export default function ConnectBody({info={location: "Address", created_at:"", profile_background:"fireflies", purpose:"for something very important", phone:"2348136066978",extra:"I'll give you 10k. Plus I'll cook rice at home", connect_id:"", gender: 0, connect_description:"a great nigerian student"}, isUser=false, canFindSimilar=true}){
    const profile = useUserStore((state) => state.profile);
    const [findSimilarIsOpen, setFindSimilarIsOpen] = useState(false);

    const message = `Hey! 👋 Saw your post on Wyspar.
    
    You're looking for someone ${info.purpose}
    
    You're around ${info.location}, right? That works for me.
    
    Also noted: ${info.extra}
    
    Let's link up! When are you free? 🔥`;

    const encoded = encodeURIComponent(message);

    async function ShareConnect(){
        const details = `${UUIDToBase62(info.connect_id)}?(!)?${info.purpose}?(!)?${info.phone}?(!)?${info.location}?(!)?${info.extra.slice(0, 30)}`;
        const url = FRONTEND_URL + "/connect/" + encodeURIComponent(details);

        await navigator.share({
            url: url,
        });
    };

    async function DeleteConnect(){
        const res = await Request("/app/user/me/delete/connect", "POST", { connect_id: info.connect_id });
        if(res.ok){
            
        };
    };
    
    return (
        <>
            <div className="flex flex-col relative gap-1 ml-10 mr-10 ">
                <div className="relative pb-2 bg-[rgb(3,6,9)] border-1 border-gray-800/50 p-5 rounded-3xl flex flex-col items-center gap-2 overflow-hidden">
                    <div className="w-full top-0 h-30 bg-white/5 absolute overflow-hidden">
                        <div className="absolute bottom-0.5 right-1 text-gray-300 z-1"><Share2 onClick={ShareConnect} strokeWidth={1.5}/></div>
                        <AnimatedBackground fps={20} adaptivePerformance={true} enablePerformanceMonitoring={true} style={{height: "", position:"absolute", top: 0, left: 0, zIndex:0}} animationName={info.profile_background || profile.details.profile_background} interactivity={true}/>
                    </div>
                    <div className="flex flex-row relative w-full justify-between items-center text-xs">
                        <span className="flex flex-row items-center gap-1 bg-[orangered] p-0.5 pl-2 pr-2 rounded-full"><MapPin size={17}/>{info.location}</span>
                        <div className="flex items-center gap-1 text-gray-100"><Clock size={17}/>{TimeAgo(info.created_at || 0)}</div>
                    </div>
                    <div className="h-20 z-0 w-20 bg-red-900 rounded-full overflow-hidden"><Image alt="picture anonymous" src={String(info.gender) != "undefined" ? (info.gender == 0 ? "/male.png":"/female.png"):(profile.gender == 0 ? "/male.png":"/female.png")} height={100} width={100}/></div>
                    <div className="text-sm pl-5 pr-5 text-center">
                        <b>I'm looking for someone</b>  {info.purpose}
                    </div>
                    <Link href={`https://wa.me/${info.phone}?text=${encoded}`} className="bg-[limegreen] pl-4 pr-4 rounded-full text-lg border-2 border-white/70">connect</Link>
                    <div className="text-xs bg-[rgb(30,30,30)]/50 text-white/70 pl-3 pr-3 p-1 rounded-2xl">{info.extra}</div>
                    <div className="flex flex-col items-center gap-1">
                        
                        <div className="flex items-center gap-1 text-gray-300"><Gem size={20}/>Sees {String(info.gender) != "undefined" ? (info.gender == 0 ? "himself":"herself"):(profile.gender == 0 ? "himself":"herself")} as</div>
                        <div className="bg-[#000050] border-2 border-[#000090] p-0.5 pl-3 pr-3 rounded-full text-xs">
                            {info.connect_description || GetFromLocalStorage("connect-description")}
                        </div>
                        
                        {canFindSimilar && <div className="border-2 border-[#aa0000] bg-[#700000] pl-6 pr-6 rounded-full mt-3" onClick={() => setFindSimilarIsOpen(true)}>find similar</div>}
                    </div>
                </div>
                {isUser && <div className="flex flex-row items-center justify-center">
                    <div className="bg-[rgb(3,6,9)] border border-gray-900 w-13 h-13 flex items-center justify-center rounded-full"><Trash2 size={30} color="red"/></div>
                </div>}
            </div>
            {(findSimilarIsOpen && canFindSimilar) && <FindSimilarConnects connect_id={info.connect_id} text={info.purpose} setFindSimilarIsOpen={setFindSimilarIsOpen}/>}
        </>
    );
};