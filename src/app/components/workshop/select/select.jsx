import { ArrowLeft,  Speech, UserRoundSearch } from "lucide-react";
import ClickEffect from "../../effects/click-effect";
import StarsBackground2 from "../../animated_backgrounds/stars2";

export default function SelectWhatToPost({setAction}){
    return (
        <div className="absolute top-0 left-0 h-full max-h-[100dvh] w-full bg-black z-2 flex flex-col items-center gap-3 justify-center">
            <StarsBackground2/>
            <ArrowLeft className="absolute top-3 left-3" size={30} onClick={() => setAction("out")}/>
            <div className="relative flex flex-row gap-2">
                <div className="flex flex-col items-center">
                    <div onClick={() => setAction("post")} className="relative bg-[rgb(10,10,10)] h-20 w-20 border-2 rounded-full flex flex-col items-center justify-center">
                        <ClickEffect><Speech size={30}/></ClickEffect>
                    </div>
                    <div className="p-2 pl-3 rounded-xl">Post</div>
                </div>
                <div className="w-50 p-2 pl-3 text-gray-100 rounded-lg h-15 mt-3">
                    Post anonymously for your campus to see.
                </div>
            </div>
            <div className="relative flex flex-row gap-2">
                 <div className="flex flex-col items-center">
                    <div onClick={() => setAction("look")} className="relative bg-[rgb(10,10,10)] h-20 w-20 border-2 rounded-full flex flex-col items-center justify-center">
                        <ClickEffect><UserRoundSearch size={30}/></ClickEffect>
                    </div>
                    <div className="p-2 pl-3 rounded-xl">Connect</div>
                </div>
                <div className="w-50 p-2 pl-3 text-gray-100 rounded-lg h-15 mt-3">
                    Find someone on campus for anything.
                </div>
            </div>
        </div>
    ); 
}; 