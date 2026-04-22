import { ArrowLeft, PackageOpen } from "lucide-react";
import { useUserStore } from "../stores/user";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCards } from "swiper/modules";
import "swiper/css/effect-cards";
import "swiper/css";
import "swiper/css/navigation";
import LinksBackground2 from "@/app/components/animated_backgrounds/links2";
import ConnectBody from "@/app/components/connect_body";
import { useEffect, useState } from "react";
import Request from "@/app/lib/utils/request";
import { SyncLoader } from "react-spinners";
import { GetFromSessionStorage } from "@/app/lib/utils/session-storage";

export default function Section5(){
    const setShowing = useUserStore((state) => state.setShowing);
    const connects = useUserStore((state) => state.connects);
    const setConnects = useUserStore((state) => state.setConnects)
    const [loading, setLoading] = useState(false);

    const GetConnects = async () => {
        setLoading(true);
        const cached = GetFromSessionStorage("user-connects");
        if (cached) { setConnects(cached); return setLoading(false) }

        const data = await Request("/app/user/me/get?payload=get-connects", "GET");
        setLoading(false);

        if (!data.ok) return;
        setConnects(data.body);
    };
    useEffect(() => {
        GetConnects();
    }, []);

    return (
        <div className="w-full h-full">
            <LinksBackground2/>
            <div className="relative flex flex-row justify-center pl-3 pr-3 h-12 items-center z-1">
                <ArrowLeft onClick={() => setShowing(null)} className="absolute left-2" size={30}/>
                <span>Your connects</span>
            </div>
            {
                (!loading && connects.length > 0) && <div className="relative top-[10%] h-full">   
                <Swiper effect="cards" speed={800} modules={[Navigation,EffectCards]} spaceBetween={30} slidesPerView={1} navigation>
                    {connects.map((obj, i) => (
                        <SwiperSlide>
                            <ConnectBody isUser info={obj} key={i}/>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div> 
            }
            {
                loading && <div className="h-full w-full top-0 left-0 absolute flex items-center justify-center">
                    <SyncLoader color="white" size={20}/>
                </div>
            }
            {
                (!loading && !!!connects.length) && <div className="h-full w-full top-0 left-0 absolute flex flex-col gap-3 items-center justify-center">
                    <PackageOpen size={70}/>
                    <span>You don't have active connects</span>
                </div>
            }
            <div className="absolute bottom-0 left-0 flex p-5 justify-center w-full">Expires after 15 days of posting</div>
        </div>
    );
};