import { headers } from "next/headers";
import Preview from "./preview";
import OgMeta from "./og";
import { FRONTEND_URL } from "../../../../domain";

export default async function Whisper({params, searchParams}){
    const headersList = await headers();
    const uaString = headersList.get('user-agent') || '';
    const isBot = /(bot|crawler|spider|slurp|facebookexternalhit|twitterbot|whatsapp)/i.test(uaString);

    if(!isBot) return <Preview/>;

    const og_obj = {
        anonymous_name: searchParams?.ogWysparer || "Wysparer",
        school: searchParams?.ogSchool || "",
        content: searchParams?.ogText || "Check out!",
        post_category: searchParams?.ogCategory || "whisper",
        image: FRONTEND_URL + `/og/${Math.floor(Math.random() * 5) + 1}.jpeg`,
    };
    if(isBot) return <OgMeta og_obj={og_obj}/>
};