import { headers } from "next/headers";
import Preview from "./preview";
import OgMeta from "./og";
import { FRONTEND_URL } from "../../../../../../../../../domain";

export default async function Whisper({params}){
    const headersList = await headers();
    const uaString = headersList.get('user-agent') || '';
    const isBot = /(bot|crawler|spider|slurp|facebookexternalhit|twitterbot|whatsapp)/i.test(uaString);

    if(!isBot) return <Preview/>;

    const { anonymous_name, school, content, post_category} = await params;
    const og_obj = {
        anonymous_name: anonymous_name,
        school: school,
        content: content,
        post_category: post_category,
        image: FRONTEND_URL + `/og/${Math.floor(Math.random() * 5) + 1}.jpeg`,
    };
    
    if(isBot) return <OgMeta og_obj={og_obj}/>
};