"use client";
import { APP_NAME } from "@/app/lib/data/app-name";
import { Bell, Dot, Download, Telescope, UserRoundPlus, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ClickEffect from "../effects/click-effect";
import Link from "next/link";
import { FRONTEND_URL } from "../../../../domain";
import Request from "@/app/lib/utils/request";
import { useEffect, useState } from "react";
import { GetFromLocalStorage, SaveToLocalStorage } from "@/app/lib/utils/local-storage";
const VAPID_PUBLIC_KEY = "BAts9LBPzoXaSi3SrSIb7HNoaK4eaL6q39WJExURcrwLZXtFjQMg_95zFt_8LPHHr0eKS0Zuav2eCEKW1qKRpTA";


function urlBase64ToUint8Array(base64String){
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0))); 
};


export default function Header({className , ...props}){
    const [defferedPrompt, setDefferedPrompt] = useState(null);
    const [showInstallBtn, setShowInstallBtn] = useState(false);
    const [isRecievingPush, setIsReceivingPush] = useState();

    useEffect(() => {
        const isInstalled = window.matchMedia("(display-mode:standalone)").matches || window.navigator.standalone === true;
        if(isInstalled) return;
        
        const handler = (e) => {
            e.preventDefault();
            setDefferedPrompt(e);
            setShowInstallBtn(true);
        };

        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
    });

    const HandleInstall = async () => {
        if(!defferedPrompt) return;
        defferedPrompt.prompt();

        const choice = await defferedPrompt.userChoice;
        if(choice.outcome === "dismissed") return;
        setShowInstallBtn(false);
    };

    const pathname = usePathname();
    const shareWyspar = async () => {
        await navigator.share({
            url: FRONTEND_URL,
            title: "Join Wyspar now!"
        })
    };

    useEffect(() => {
        async function CheckNotices(){
            //check if user is already subed
            const registration = await navigator.serviceWorker.ready;
            const is_subscribed_to_push = await registration.pushManager.getSubscription();
            if(is_subscribed_to_push) {
                return setIsReceivingPush(true);
            };

            const has_reminded_today = GetFromLocalStorage("has_reminded_today");
            if(!has_reminded_today) {
                SaveToLocalStorage("push_status", true, 1000 * 60 * 60 * 24);
                return alert("Click the bell/notification icon at the top right of your screen to receive notifications! about your post🔥⚡👑");
            };
        };

        CheckNotices();
    }, []);

    const SubscribeToNotices = async () => {
        if(!("serviceWorker" in navigator) && !("PushManager" in window)) return;

        try {
            const permission = await Notification.requestPermission();
            if(permission !== "granted") return alert("Wyspar can't send you notifications because you denied. Try changing your browser settings.");

            const registration = await navigator.serviceWorker.ready;

            //check if user is already subed
            const is_subscribed_to_push = await registration.pushManager.getSubscription();
            if(is_subscribed_to_push) return alert("You've already subscribed to receive notifications 😎⚡💥");

            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });

            try {
                const res = await Request("/app/user/me/push-subscription?action=save", "POST", subscription);
                if (res.ok){
                    alert("You will now receive notifications from Wyspar! 💥⚡👑");
                    setIsReceivingPush(true);
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
                {showInstallBtn && <b onClick={HandleInstall} className="flex flex-row items-center gap-2 text-sm border-2 pl-4 pr-4 p-0.5 rounded-full bg-[greenyellow]/60">Install <Download strokeWidth={3} size={15}/></b>}
                {pathname === "/me/profile" && <UserRoundPlus onClick={shareWyspar}/>}
                {pathname === "/explore" && <ClickEffect><Link href="/search"><Telescope strokeWidth={3}/></Link></ClickEffect>}
                <div className="relative">
                    <Bell onClick={SubscribeToNotices}/>
                    {isRecievingPush ? <Dot className="top-[-21px] right-[-17px] absolute pointer-events-none" color="greenyellow" size={50}/>:<X className="top-[-4px] right-[-1px] absolute pointer-events-none" color="red" size={15} strokeWidth={3}/>}
                </div>
            </div>
        </div>
    );
};