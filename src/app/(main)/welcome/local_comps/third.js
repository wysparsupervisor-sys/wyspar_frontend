import { FlagTriangleLeft, FlagTriangleRight, Ghost, HatGlasses, Heart } from "lucide-react";
import { useEffect, useState } from "react";

export default function Third({state}){
    const { current } = state;
    const [isHidden, setIsHidden] = useState(current !== 4);

    useEffect(() => {
        setIsHidden(current !== 4);
    }, [current]);
    
    return (
        <div className={`z-2 top-0 left-0 fixed w-full h-full flex flex-col gap-9 pl-5 justify-center transition-all ${isHidden ? "opacity-0 pointer-events-none":"opacity-100"}`} style={{transitionDuration: "4s"}}>
            <b className="text-3xl flex flex-row items-center gap-3">Anonymous <HatGlasses strokeWidth={2} size={40}/></b>
            <div className="bg-[rgb(10,10,10)] rounded-lg text-sm max-w-85 p-3 border-l-3 border-red-600" style={{boxShadow: "inset 10px 10px 20px black", lineHeight: 1.5}}>
                No one knows it's you if you can keep a secret safe🤐 You're <b>an avatar with a virtual identity.</b> Red flag
                 or green flag posts, show some love💖,  or drop a comment <b>as a ghost 👻.</b> Here you're <b>invincible💥</b>
            </div>
            <div className="flex flex-wrap gap-2 items-center text-sm">
                <div className="flex-shrink-0 border-2 border-[red] pl-4 pr-4 rounded-full flex flex-row items-center gap-2 p-0.5"><FlagTriangleLeft color="red" size={20}/> red-flag</div>
                <div className="flex-shrink-0 border-2 border-[greenyellow] pl-4 pr-4 rounded-full flex flex-row items-center gap-2 p-0.5"><FlagTriangleRight color="greenyellow" size={20}/>green-flag</div>
                <div className="flex-shrink-0 border-2 border-[cyan] pl-4 pr-4 rounded-full flex flex-row items-center gap-2 p-0.5"><Heart color="cyan" size={20}/>  love</div>
                <div className="flex-shrink-0 border-2 border-white pl-4 pr-4 rounded-full flex flex-row items-center gap-2 p-0.5"><Ghost/> comment</div>
            </div>
        </div>
    );
};