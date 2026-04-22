import { ArrowLeft } from "lucide-react";
import { createPortal } from "react-dom";
import ConnectBody from "@/app/components/connect_body";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCards } from "swiper/modules";
import "swiper/css/effect-cards";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import Request from "@/app/lib/utils/request";
import { useUserStore } from "@/app/(main)/me/profile/local_comps/stores/user";
import ExpiryWarning from "../micellanious/expired-warning";

export default function FindSimilarConnects({setFindSimilarIsOpen, text, connect_id}){
    const similar_connects = useUserStore((state) => state.similar_connects);
    const addNewSimilarConnect = useUserStore((state) => state.addNewSimilarConnect);
    const [loading, setLoading] = useState(true);
    const [similarConnects, setSimilarConnects] = useState([]);
    const [hasExpired, setHasExpired] = useState(false);

    async function GetSimilarConnects() {
        
        if (similar_connects[connect_id]) {
            setSimilarConnects(similar_connects[connect_id]);
            setLoading(false);
        } else {
            const res = await Request(`/app/connect_feed?action=similar&purpose=${encodeURIComponent(text)}&connect_id=${encodeURIComponent(connect_id)}`, "GET");
            setLoading(false);
            if(res.cause === "nosub") {
                setHasExpired(true);
            } else {
                setSimilarConnects(res.body || []);
                addNewSimilarConnect(connect_id, res.body);
            };
        };       
    };

    useEffect(() => {
        GetSimilarConnects();
    }, []);

    return createPortal(
        <div className="fixed backdrop-blur top-0 left-0 h-full w-full bg-black/60 z-7 overflow-scroll">    
            <div className="p-3 h-full flex flex-col items-center justify-center">
                <h1 className="absolute top-0 left-0 p-3 flex flex-row items-center gap-2"><ArrowLeft onClick={() => setFindSimilarIsOpen(false)}/> Similar Connects</h1>
                {!loading && <div className="relative w-full mt-3">
                    <Swiper effect="cards" speed={800} modules={[Navigation,EffectCards]} spaceBetween={30} slidesPerView={1} navigation>
                                        
                        {similarConnects.map((obj) => (
                            <SwiperSlide>
                                <ConnectBody info={obj} canFindSimilar={false}/>
                            </SwiperSlide>
                        ))}
                        
                    </Swiper>
                </div>}
                {loading && <SyncLoader color="white"/>}
                {hasExpired && <ExpiryWarning/>}       
            </div>
        </div>,
        document.body
    )
}