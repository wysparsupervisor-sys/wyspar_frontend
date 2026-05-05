import { headers } from "next/headers";
import OgMeta from "./og";
import { redirect } from "next/navigation";

export default async function Whisper({}){
    const headersList = await headers();
    const uaString = headersList.get('user-agent') || '';
    const isBot = /(bot|crawler|spider|slurp|facebookexternalhit|twitterbot|whatsapp)/i.test(uaString);

    if(!isBot) return redirect("/login");

    if(isBot) return <OgMeta/>
};