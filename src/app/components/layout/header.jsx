"use client";
import { APP_NAME } from "@/app/lib/data/app-name";
import { Bell, Telescope, UserRoundPlus } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ClickEffect from "../effects/click-effect";
import Link from "next/link";
import { FRONTEND_URL } from "../../../../domain";
import Request from "@/app/lib/utils/request";
import { useEffect } from "react";
import { GetFromLocalStorage, SaveToLocalStorage } from "@/app/lib/utils/local-storage";
const VAPID_PUBLIC_KEY = "BAts9LBPzoXaSi3SrSIb7HNoaK4eaL6q39WJExURcrwLZXtFjQMg_95zFt_8LPHHr0eKS0Zuav2eCEKW1qKRpTA";


function urlBase64ToUint8Array(base64String){
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0))); 
};


export default function Header({className , ...props}){
    const pathname = usePathname();
    const shareWyspar = async () => {
        await navigator.share({
            url: FRONTEND_URL,
            title: "Join Wyspar now!"
        })
    };

    useEffect(() => {
        async function CheckNotices(){
            const is_pushing = GetFromLocalStorage("is_pushing");
            if(is_pushing === "") return;

            const push_status = GetFromLocalStorage("push_status");
            if(push_status !== "") {
                SaveToLocalStorage("push_status", "", 1000 * 60 * 60 * 24);
                return alert("Click the bell/notification icon at the top right of your screen to receive post notifications!🔥⚡👑");
            };
        };
    }, []);

    const SubscribeToNotices = async () => {
        if(!("serviceWorker" in navigator) && !("PushManager" in window)) return;

        try {
            const permission = await Notification.requestPermission();
            if(permission !== "granted") return alert("Wyspar can't send you notifications because you denied. Try changing your browser settings.");

            const registration = await navigator.serviceWorker.ready;

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });

            try {
                const res = await Request("/app/user/me/push-subscription?action=save", "POST", subscription);
                if (res.ok){
                    alert("You will now receive notifications from Wyspar! 💥⚡👑");
                    SaveToLocalStorage("is_pushing", "", 1000 * 60 * 60 * 24 * 365);
                };
                if(!res.ok){
                    await subscription.unsubscribe();
                    alert("Something didn't go right. Try again.");
                };
            } catch (err) {
                await subscription.unsubscribe();
                alert("Something didn't go right. Try again.");
            };
        } catch (err) {
            alert("Something didn't go right. Try again later.");
            console.error("Failed to subscribe notifications:", err);
        };
    };

    return (
        <div className={`fixed h-[55px] top-0 w-full bg-black flex ${pathname !== "/explore" && "border-b border-gray-900"} flex-row items-center justify-between pl-2 pr-2 left-0 ${className}`} {...props}>
            <div className="flex flex-row items-center gap-1">
                <Image src="/logo.png" height={47} width={47} alt="logo" className="rounded-full"/><b className="text-lg">{APP_NAME}</b>
            </div>
            <div className="pr-1 flex flex-row items-center gap-3">
                {false &&  <Bell onClick={SubscribeToNotices}/>}
                {pathname === "/me/profile" && <UserRoundPlus onClick={shareWyspar}/>}
                {pathname === "/explore" && <ClickEffect><Link href="/search"><Telescope strokeWidth={3}/></Link></ClickEffect>}
            </div>
        </div>
    );
};