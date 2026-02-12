"use client";
import { UUIDToBase62 } from "@/app/lib/utils/base-converter";
import { Eraser, RefreshCcw, Share2, Trash2 } from "lucide-react";
import { FRONTEND_URL } from "../../../../../../domain";
import { usePostViewContext } from "../../context";
import ClickEffect from "@/app/components/effects/click-effect";
import Request from "@/app/lib/utils/request";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { produce } from "immer";
import { SaveToSessionStorage } from "@/app/lib/utils/session-storage";
import { POST_CATEGORIES } from "@/app/lib/data/post-categories";


export default function Menu({className, info, menuIsVisible, school}){
    const { postStates, _ } = usePostViewContext();
    const [isSure, setIsSure] = useState(false);
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const { anonymous_name, content, post_category } = info;

    useEffect(() => {
        setIsSure(false);
    }, [menuIsVisible]);
    
    const SharePost = async () => {
        const shared_url = FRONTEND_URL + "/whisper" + `/${school}` + `/${post_category}` + `/${anonymous_name}` + `/${encodeURIComponent(content)}/` + UUIDToBase62(info.post_id);
        await navigator.share({
            url: shared_url
        });
    };

    const handleDelete = async () => {
        setLoading(true); setFailed(false);
        const res = await Request("/app/user/me/delete/post", "POST", { post_id: info.post_id });
        if (!res.ok) {
            setFailed(true);
            console.log("Error")
        } else {
            //if success then erase from zustand object
            postStates.Store.setState(produce((state) => {
                let all_index = null;
                let cat_index = null;
                if (state.posts["all"]) {
                    all_index = state.posts["all"].findIndex((p) => p.post_id = info.post_id);
                    console.log(all_index);
                };
                if (state.posts[POST_CATEGORIES[info.post_category]]) {
                    cat_index = state.posts[POST_CATEGORIES[info.post_category]].findIndex((p) => p.post_id = info.post_id);
                };
        
                if ((all_index !== null) && (all_index !== -1)) {
                    state.posts["all"].splice(all_index, 1);
                };
                if((cat_index !== null) && (cat_index !== -1)) {
                    state.posts[POST_CATEGORIES[info.post_category]].splice(cat_index, 1);
                };

                state.profile.stats.posts += -1;
                
                SaveToSessionStorage("user-posts", state.posts, 1000 * 60 * 5);
            }));
        };
        
        setLoading(false);
    };

    return (
        <div className={`absolute right-0 bg-black flex flex-col gap-3 p-2 border-2 border-gray-900 rounded-xl ${className}`}>
            <div className="flex flex-row items-center gap-3" onClick={SharePost}><ClickEffect><Share2 strokeWidth={1.6}/></ClickEffect> Echo</div>
            {postStates.isUser && <div className="flex flex-row items-center gap-3">
                {isSure ? 
                    <div className={`flex w-full flex-row items-center justify-between ${loading && "pointer-events-none"}`} onClick={handleDelete}>
                        {!loading && !failed && <Trash2 color="orangered" strokeWidth={1.6}/>}
                        {loading && !failed && <ClipLoader size={20} color="white"/>}
                        {failed && !loading && <RefreshCcw onClick={handleDelete} strokeWidth={1.6}/>} Delete
                    </div>:
                    <div className="w-full flex flex-row items-center justify-between" onClick={() => setIsSure(true)}>
                        <Eraser color="orangered" strokeWidth={1.6}/> Erase
                    </div>
                }
            </div>}
        </div>
    );
};