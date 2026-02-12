import { Activity, Check, MessageCircle, RefreshCcw, X } from "lucide-react";
import StarsBackground from "../../animated_backgrounds/stars";
import { useState } from "react";
import { BarLoader, SyncLoader } from "react-spinners";
import Request from "@/app/lib/utils/request";


export default function MakeFeedback({pageIsOpen}){
    const [text, setText] = useState("");
    const [postingState, setPostingState] = useState("");

    const SendFeedBack = async () => {
        setPostingState("sending");
        const res = await Request("/app/user/me/feedback", "POST", { feedback: text });
        if (!res.ok) return setPostingState("failed");
        if (res.ok) setPostingState("success");

        setTimeout(() => pageIsOpen(false), 2000);
    };

    return (
        <div className="absolute flex flex-col w-full h-full max-h-[100dvh] bg-black z-2">
            <StarsBackground/>
            <div className="flex text-sm flex-row gap-2 items-center p-2">
                <X size={30} strokeWidth={1.6} onClick={() => pageIsOpen(false)}/>
                <span className="border-2 border-gray-500/60 pl-3 pr-3 rounded-full">suggestions</span>
                <span className="border-2 border-yellow-500/60 pl-3 pr-3 rounded-full">feedback</span>
                <span className="border-2 border-red-500/60 pl-3 pr-3 rounded-full">issues</span>
            </div>
            <div className="flex-grow-1 p-3">
                <textarea maxLength={300} placeholder="Tell us how we can improve! At least 30 character." className="w-full text-gray-300 text-lg outline-none" onInput={
                    (e) => {
                        const el = e.target;
                        el.style.height = "auto";
                        const newHeight = el.scrollHeight;
                        el.style.height = `${newHeight}px`;
                        setText(el.value);
                    }
                }></textarea>
            </div>
            <div className="flex flex-row justify-between items-center bg-black p-1 pl-4 pr-4 border-t border-gray-900 h-13">
                <div className="flex flex-row gap-2 justify-between items-center">
                    <Activity/>{300 - Number(text.length)}
                </div>
                {text.trim().length > 30 && <b onClick={SendFeedBack} className="bg-[#5a0019ff] flex flex-col items-center justify-center p-2 pl-5 pr-5 rounded-xl border">send</b>}
            </div>
            {postingState && <div className="absolute flex flex-col items-center justify-center top-0 left-0 bg-black/90 h-full w-full z-9">
                <div className="flex flex-col gap-4 items-center">
                    {postingState == "sending" && <>
                        <MessageCircle size={80}/>
                        <p className="text-lg text-gray-200">Sending Your Opinions...</p>
                        <SyncLoader color="white"/>
                    </>}
                    {postingState == "success" && <>
                        <Check size={80}/>
                        <p className="text-lg text-gray-200">You've been heard...</p>
                        <BarLoader color="white"/>
                    </>}
                    {postingState == "failed" && <>
                        <X className="absolute top-5 left-5" size={30} onClick={() => setPostingState(null)}/>
                        <RefreshCcw size={60} onClick={SendFeedBack}/>
                        <p className="text-lg text-center text-gray-200">Something went wrong! <br/> Try again</p>
                    </>}
                </div>
            </div>}
        </div>
    );
};