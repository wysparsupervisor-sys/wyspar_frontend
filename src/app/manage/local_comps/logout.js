"use client";
import Request from "@/app/lib/utils/request";
import { DoorOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ClipLoader } from "react-spinners";

export default function LogOut(){
    const router = useRouter();
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const LogOut = async () => {
        setLoading(true);
        const res = await Request("/app/user/me/logout", "GET");
        if (res.ok) router.push("/login");
    };

    return (
        <>
            <div className="mt-7 flex flex-row justify-between border border-gray-900/20 rounded-xl p-3 bg-[#000015]">
                <div className="flex items-center gap-1">
                    <DoorOpen/>
                    <p>Log out</p>
                </div>
                <button className="text-[orange] underline" onClick={() => setShow(true)}>Continue</button>
            </div>
            {show && <div className="w-full top-0 left-0 fixed bg-black/90 h-full flex flex-col items-center justify-center">
               <div className="max-w-3xs p-2 flex flex-col gap-3">
                    <p>Are you sure you want to logout of your account?</p>
                    <div className="flex flex-row gap-2">
                        <button className="w-full border-2 p-1 rounded-lg" onClick={() => {setShow(false); setLoading(false)}}>No</button>
                        <button className="w-full border-2 rounded-lg border-[orangered] flex flex-row items-center justify-center"  onClick={LogOut}>{loading ? <ClipLoader color="white" size={20}/>:"Yes"}</button>
                    </div>
               </div>
            </div>}
        </>
    )
}