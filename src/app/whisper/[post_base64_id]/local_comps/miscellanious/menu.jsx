import { UUIDToBase62 } from "@/app/lib/utils/base-converter";
import { Share2 } from "lucide-react";
import ClickEffect from "@/app/components/effects/click-effect";
import { FRONTEND_URL } from "../../../../../../domain";


export default function Menu({className, info}){
    const { anonymous_name, content, post_category } = info;
    
    const SharePost = async () => {
        const shared_url = FRONTEND_URL + "/whisper/" + UUIDToBase62(info.post_id);
        await navigator.share({
            url: `${shared_url}?ogWysparer=${anonymous_name}&ogText=${content.slice(0, 30)}&ogCat=${post_category}&ogSchool=${info.school}`,
        });
    };

    return (
        <div className={`absolute right-0 bg-black flex flex-col gap-3 p-2 border-2 border-gray-900 rounded-xl ${className}`}>
            <div className="flex flex-row items-center gap-3" onClick={SharePost}><ClickEffect><Share2 strokeWidth={1.6}/></ClickEffect> Echo</div>
        </div>
    );
};