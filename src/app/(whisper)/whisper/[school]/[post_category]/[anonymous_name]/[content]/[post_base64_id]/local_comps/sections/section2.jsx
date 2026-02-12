import { POST_TYPES } from "@/app/lib/data/post-types";
import { POST_STYLES } from "@/app/lib/data/post-styles";
import { Inter } from "next/font/google";
import { useState } from "react";
import LazyImage from "@/app/components/images/lazy-image";
import { MEDIA_GET_URL } from "../../../../../../../../../../../domain";


//font
const inter = Inter({subsets: ["latin"], variable: "--font-inter", weight: ["300"]});
export default function Section2({info}){
    const { post_type, post_style, content, images } = info;
    const [isSliced, setIsSliced] = useState(true);

    return (
        <div className="">
            {POST_TYPES[post_type] == "article" && <div>
                <p className={`pb-3 p-1 text-gray-300 ${inter.className}`}>{isSliced ? content.slice(0,150):content} {content.slice(0,150).length !== content.length && <>{isSliced ? <b className="font-semibold text-white" onClick={() => setIsSliced(false)}>...Peak</b>:<b onClick={() => setIsSliced(true)} className="font-semibold text-white">Peak less</b>}</>}</p>
                <div className="z-[-3]">
                    {images && <LazyImage src={MEDIA_GET_URL + "/"+images[0]} width={500} height={500} alt="post image" className="w-full rounded-xl" unoptimized/>}
                </div>
            </div>}
            {POST_TYPES[post_type] == "statement" && <>
                <div className={`outline-none ${POST_STYLES[post_style]} flex flex-col justify-center items-center text-center rounded-xl p-3 ${content.length < 90 ? "text-2xl":"text-lg"}`} style={{aspectRatio: "4/3"}}>{content}</div>
            </>}
        </div>
    );
};