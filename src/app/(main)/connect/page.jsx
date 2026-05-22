"use client"
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


export default function ExploreConnect(){
    const [connects, setConnects] = useState([]);
    const [connectBlock, setConnectBlock] = useState();
    const [isDiscoveringConnects, setIsDiscoveringConnects] = useState(false);
    const [loading, setLoading] = useState(true);
    
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
                SaveToLocalStorage('personalized_connect', res.body, 1000 * 60 * 60 * 1);
            };
        };
        
        setLoading(false);
    };

    useEffect(() => {
        const val = GetFromLocalStorage("connect-block") ? true:false;
        setConnectBlock(val);
        LoadConnects();
    }, []);

    const InviteFriends = async () => {
        try {
            await navigator.share({
                title: "Check out this app made for campus.",
                text: "It's for finding people on campus that match your vibes and also a social media app for students specifically.",
                url: "https://www.wyspar.com/share",
            });
            setConnectBlock(false);
            localStorage.removeItem("connect-block");
        } catch (error) {
            console.log(error);
        };
    };
    
    return (
        <>
            {<div className="pb-3 w-screen relative overflow-x-hidden mt-[55px]">
                <div className="p-2 text-xl text-center ">
                    Personalized Connects
                </div>
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
                {connectBlock && <div className="absolute top-0 left-0 bg-black/80 h-full w-full z-1 flex flex-col items-center justify-center p-5 gap-5">
                    <p className="text-xl text-center text-gray-100">Invite 5 friends on WhatsApp to see all connects.</p> 
                    <b onClick={InviteFriends} className="bg-[#000060] border-2 w-40 p-2 rounded-xl text-center">Invite Friends</b>        
                </div>}
            </div>}
        </>
    );
};