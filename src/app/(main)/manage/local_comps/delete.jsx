"use client";
import { DynamicTextArea } from "@/app/components/inputs/dynamic-textarea";
import Request from "@/app/lib/utils/request";
import { useUserStore } from "@/app/(main)/me/profile/local_comps/stores/user";
import { AlertTriangle, HandHeart, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ClipLoader } from "react-spinners";

export default function DeleteAccount(){
    const router = useRouter();
    const [show, setShow] = useState(false);
    const profile = useUserStore((state) => state.profile);
    const [reasonText, setReasonText] = useState("");
    const [loading, setLoading] = useState(false);
    const reasonRef = useRef(null);
    const [finalize, setFinalize] = useState(false);

    const Proceed = () => {
        const reason = reasonRef.current?.value;
        Request("/app/user/me/feedback", "POST", { feedback: "DAB:" + reason });
        setFinalize(true);
    };

    const DeleteFinal = async () => {
        setLoading(true);
        const res = await Request("/app/user/me/deleteaccount", "GET");
        if (res.ok) router.push("/login");
    };

    return (
        <>
            <div className="flex flex-row justify-between border border-gray-900/20 rounded-xl p-3 bg-[#000015]">
                <div className="flex items-center gap-1">
                    <Trash2/>
                    <p>Delete Account</p>
                </div>
                <button className="text-[orangered] underline" onClick={() => setShow(true)}>Delete</button>
            </div>
            {show && <div className="fixed z-2 top-0 left-0 bg-black/90 h-full w-full flex flex-col items-center justify-center">
                <X color="white" className="absolute top-3 left-3" size={40} onClick={() => {setShow(false); setLoading(false); setFinalize(false)}}/>
                <div className="w-3xs flex flex-col items-center gap-2">
                    {finalize ? 
                        <>
                            <HandHeart size={70}/>
                            <p className="text-center mt-1">Well, since you insist <b>{profile && profile.anonymous_name}, Your engagement in this community built by students has been very welcoming. Thank you for everything 💙💚🤍💖</b></p>
                            <button onClick={DeleteFinal} className="bg-red-700 p-2 pl-15 pr-15 rounded-lg mt-1 flex flex-col items-center justify-center">{loading ? <ClipLoader color="white" size={20}/>:"Delete"}</button>
                        </>:
                        <>
                            <AlertTriangle color="red" size={70}/>
                            <p >We'll miss you!! But before you go please tell us why you're leaving🥺</p>
                            <DynamicTextArea placeholder="30 characters please" onChange={(e) => setReasonText(reasonRef.current.value)} ref={reasonRef} minLength={30} maxLength="296"/>
                            {reasonText.trim().length > 29 && <button className="border-2 border-red-600 p-1 pl-5 pr-5 rounded-2xl" onClick={Proceed}>Proceed 😫😭</button>}
                        </>
                    }
                </div>
            </div>}
        </>
    );
};