import ConnectBody from "@/app/components/connect_body";
import { ArrowLeft, RefreshCcw, UserSearch } from "lucide-react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCards } from "swiper/modules";
import "swiper/css/effect-cards";
import "swiper/css";
import "swiper/css/navigation";
import { useEffect, useState } from "react";
import Request from "@/app/lib/utils/request";
import { Virtuoso } from "react-virtuoso";
import { PropagateLoader } from "react-spinners";
import ExpiryWarning from "@/app/components/micellanious/expired-warning";
import { GetFromSessionStorage, SaveToSessionStorage } from "@/app/lib/utils/session-storage";

export default function Section3({setIsDiscovering}){
    const MAX_ITEMS = 10;
    const [firstItemIndex, setFirstItemIndex] = useState(0);
    const [connects, setConnects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const [hasExpired, setHasExpired] = useState(false);

    async function GetDiscoveredConnects() {
        const cached = GetFromSessionStorage("discover-connects");
        if(cached && connects.length === 0) return setConnects(cached);

        setFailed(false); setLoading(true);
        const res = await Request("/app/connect_feed?action=discover", "GET");
        setLoading(false);

        if(!res.ok){
            setFailed(true);
        } else if(res.cause && res.cause == "nosub"){
            setHasExpired(true);    
        } else if(res.ok && res.body.length > 0){
            setConnects(prev => {
                const combined = [...prev, ...res.body];

                if(combined.length > MAX_ITEMS) {
                    const trimmed = combined.slice(combined.length - MAX_ITEMS);
                    const removed = combined.length - MAX_ITEMS;
                    setFirstItemIndex(i => i + removed);
                    SaveToSessionStorage("discover-connects", trimmed, 1000 * 60 * 7);
                    return trimmed
                };
                SaveToSessionStorage("discover-connects", combined, 1000 * 60 * 7);
                return combined
            });
        };
    };

    useEffect(() => {
        GetDiscoveredConnects();
    }, []);

    return createPortal(
        <div className="fixed backdrop-blur overflow-y-scroll overflow-x-hidden top-0 left-0 w-full h-full bg-black/70 z-2">
            <div className="flex ites-center justify-between gap-2 p-3 bg-black border-b border-gray-900"a>
                <div className="flex ites-center gap-2"><ArrowLeft onClick={() => setIsDiscovering(false)}/> Discover Connects</div>
                <UserSearch/>
            </div>

            
            <Virtuoso 
                firstItemIndex={firstItemIndex}
                endReached={() => GetDiscoveredConnects()} 
                data={connects} 
                itemContent={(i, arr) => 
                <div key={i} className="border-b-3 border-white/80 pb-3 pt-3 overflow-hidden">
                    <Swiper effect="cards" speed={800} modules={[Navigation,EffectCards]} spaceBetween={30} slidesPerView={1} navigation>
                        {arr.map((val) => (
                            <SwiperSlide>
                                <ConnectBody canFindSimilar={false} info={val}/>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>}
                components={{
                    Footer: () => 
                        <div className="relative flex flex-col text-gray-300 items-center justify-center p-5">
                            {loading && <PropagateLoader color="white" className="mb-4"/>}
                            {failed && <div className="flex flex-col items-center justify-center gap-5 text-sm">
                                <RefreshCcw size={50} onClick={GetDiscoveredConnects}/>
                                <span>Something went wrong. Retry!</span>
                            </div>}
                            {hasExpired && <ExpiryWarning/>}
                        </div>
                }}
            />                
            
        </div>,
        document.body
    )
}