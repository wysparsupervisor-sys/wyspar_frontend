import Image from "next/image";
import { useState } from "react";
import { ClimbingBoxLoader }  from "react-spinners"

export default function LazyImage({ src, alt, width, height, className, ...props }){
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="w-full relative z-[-1]">
            {!loaded && <div className="absolute w-full h-full flex flex-col items-center justify-center rounded-xl bg-[rgb(10,10,10)]">
                <ClimbingBoxLoader color="white"/>
            </div>}
            <Image src={src} alt={alt} width={width} height={height} className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100":"opacity-0"}`} onLoadingComplete={() => setLoaded(true)} {...props}/>
        </div>
    )
}