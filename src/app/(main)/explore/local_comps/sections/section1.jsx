"use client";
import { POST_CATEGORIES, POST_CATEGORIES_ICONS } from "@/app/lib/data/post-categories";
import { useFeedStore } from "../stores/feed";
import { Circle } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCards } from "swiper/modules";
import "swiper/css/effect-cards";
import "swiper/css";
import "swiper/css/navigation";
import ConnectBody from "@/app/components/connect_body";
import Request from "@/app/lib/utils/request";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GetFromLocalStorage, SaveToLocalStorage } from "@/app/lib/utils/local-storage";
import Section3 from "./section3";

export default function Section1(){
    const [connects, setConnects] = useState([]);
    const [isDiscoveringConnects, setIsDiscoveringConnects] = useState(false);
    const [loading, setLoading] = useState(true);
    const updatePostCategory = useFeedStore((state) => state.updatePostCategory);
    const postCategory = useFeedStore((state) => state.postCategory);

    const LoadConnects = async () => {
        setLoading(true);
        //check cache first
        const cached = GetFromLocalStorage('personalized_connect');
        if(cached) {
            setConnects(cached);
        } else {
            const res = await Request("/app/connect_feed?action=personalized", "GET");
            if (res.ok) {
                setConnects(res.body || []);
                SaveToLocalStorage('personalized_connect', res.body, 1000 * 60 * 60 * 12);
            };
        };
        
        setLoading(false);
    };

    useEffect(() => {
        LoadConnects();
    }, []);

    return (
        <>
            <div className="w-full mt-[55px] flex flex-row items-center justify-around gap-3 p-2 pt-0 overflow-x-scroll">
                <p onClick={() => updatePostCategory("all")} className={`flex flex-row items-center gap-2 p-1.5 text-sm bg-gray-900/60 pl-4 pr-4 rounded-xl ${"all" === postCategory && "border-2 border-[#000090]/50"}`}><Circle size={20}/> all</p>
                {POST_CATEGORIES.map((val, i) => {
                    const Icon = POST_CATEGORIES_ICONS[val].icon;
                    return (<p key={i} onClick={() => updatePostCategory(val)} className={`flex flex-row items-center gap-2 p-1.5 text-sm bg-gray-900/60 pl-4 pr-4 rounded-xl ${val === postCategory && "border-2 border-[#000090]/50"}`}><Icon size={20} color={POST_CATEGORIES_ICONS[val].color}/>{val}</p>)
                })}
            </div>
            <div className="pb-3 w-screen relative overflow-hidden">
                <Swiper effect="cards" speed={800} modules={[Navigation,EffectCards]} spaceBetween={30} slidesPerView={1} navigation>
                    {!loading && (connects.length > 0) && <>
                        {connects.map((obj, i) => (
                            <SwiperSlide>
                                <ConnectBody info={obj} key={i}/>
                            </SwiperSlide>
                        ))}
                        <SwiperSlide>
                            <div className="flex flex-col items-center justify-center backdrop-blur bg-black/90 border-2 border-white/50 h-90 relative gap-1 ml-10 mr-10 rounded-2xl">
                                <button className="pl-5 pr-5 p-2 backdrop-blur-xl rounded-lg border-1" onClick={() => setIsDiscoveringConnects(true)}>Discover more</button>
                            </div>
                            {isDiscoveringConnects && <Section3 setIsDiscovering={setIsDiscoveringConnects}/>}
                        </SwiperSlide>
                    </>}
                    {loading && <>
                        <SwiperSlide>
                            <div className="ml-10 mr-10 rounded-2xl h-90 bg-[rgb(10,10,15)] overflow-hidden">
                                <motion.div className="w-full h-full bg-gradient-to-r from-transparent via-[rgb(30,30,45)] to-transparent" animate={{x: ["-150%", "70%"]}} transition={{repeat: Infinity, repeatType: "loop", duration: 2, ease: "easeIn"}}></motion.div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="ml-10 mr-10 rounded-2xl h-90 bg-[rgb(10,10,15)] overflow-hidden">
                                <motion.div className="w-full h-full bg-gradient-to-r from-transparent via-[rgb(30,30,45)] to-transparent" animate={{x: ["-150%", "70%"]}} transition={{repeat: Infinity, repeatType: "loop", duration: 2, ease: "easeIn"}}></motion.div>
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                            <div className="ml-10 mr-10 rounded-2xl h-90 bg-[rgb(10,10,15)] overflow-hidden">
                                <motion.div className="w-full h-full bg-gradient-to-r from-transparent via-[rgb(30,30,45)] to-transparent" animate={{x: ["-150%", "70%"]}} transition={{repeat: Infinity, repeatType: "loop", duration: 2, ease: "easeIn"}}></motion.div>
                            </div>
                        </SwiperSlide>
                    </>}
                    {(!(connects.length > 0) && !loading) && <span className="text-xl text-gray-500 p-3">No connects available now</span>}
                </Swiper>
            </div>
        </>
    );
};