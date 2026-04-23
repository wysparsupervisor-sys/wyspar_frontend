import { headers } from "next/headers";
import Preview from "./preview";
import OgMeta from "./og";

export default async function Whisper({params}){
    const headersList = await headers();
    const uaString = headersList.get('user-agent') || '';
    const isBot = /(bot|crawler|spider|slurp|facebookexternalhit|twitterbot|whatsapp)/i.test(uaString);

    if(isBot) return <Preview/>;

    const { details } = await params;
    const details_array = decodeURIComponent(details).split("?(!)?");

    const purpose = details_array[1];
    const phone = details_array[2];
    const location = details_array[3];
    const extra = details_array[4];

    console.log({purpose, phone, location, extra})

    if(!isBot) return <OgMeta og_obj={{purpose, phone, location, extra}}/>
};