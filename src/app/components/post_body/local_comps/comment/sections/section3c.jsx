import Request from "@/app/lib/utils/request";

import { CheckCircle, Ghost, RefreshCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useCommentsStore } from "../stores/comments";
import { usePostViewContext } from "../../../context";
import { useUserStore } from "@/app/(main)/me/profile/local_comps/stores/user";


export default function Section3C({className, info}){
    const [focused, setFocused] = useState(false);
    const { postStates, _ } = usePostViewContext();
    const profile = useUserStore((state) => state.profile);
    const updateCommentCounter = postStates.Store((state) => state.updateCommentCounter);
    const setHasUsedCache = useCommentsStore((state) => state.setHasUsedCache);
    const addNewCommentInGroup = useCommentsStore((state) => state.addNewCommentInGroup);
    const [comment, setComment] = useState("");
    const [retry, setRetry] = useState(false);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const commentRef = useRef(null);

    const commentsArray = useCommentsStore((state) => state.commentGroups[info.post_id]) || [];
    const participants = Array.from(new Set(commentsArray.map(c => c.anonymous_name)));
    const [suggestions, setSuggestions] = useState([]);
    //monitor @
    useEffect(() => {
        if(/\s/.test(comment.trimStart())) return setSuggestions([]);

        if(!comment.trim().startsWith("@")){
            setSuggestions([]);
            return;
        };

        //extract the word after @ until the first  whitespace
        const match = comment.trim().match(/^@(\S*)/);
        if(!match){
            setSuggestions([]);
            return;
        };

        const query = match[1].toLowerCase();
        const filtered = participants.filter(n => n.toLowerCase().startsWith(query));
        setSuggestions(filtered);
    }, [comment]);

    const handleComment = async () => {
        setLoading(true); setRetry(false);
        
        //tells server to include certain user data if they've not loaded their profile data in params
        const params = new URLSearchParams({ });
        if (profile) {
            params.append("withProfileData", "false");
        } else {
            params.append("withProfileData", "true");
        };

        const res = await Request(`/app/user/me/comment?${params}`, "POST", { comment: commentRef.current.value, post_id: info.post_id });
        if (res.ok){
            let obj;
            //if user has loaded their profile data into the zustand object then use that for optimistic ui else get it
            if (profile) {
                obj = {created_at: res.body.created_at, comment_id: res.body.comment_id, avatar: profile.details.avatar, school: profile.school, anonymous_name: profile.anonymous_name, comment: comment}
            } else {
                obj = {created_at: res.body.created_at, comment_id: res.body.comment_id, avatar: res.body.details.avatar, school: res.body.school, anonymous_name: res.body.anonymous_name, comment: comment}
            };

            //update certain things locally for optimistic ui first increment post comment couter locally
            updateCommentCounter(1, info.post_id);
            addNewCommentInGroup(info.post_id, [obj]);

            commentRef.current.style.height = "auto";
            commentRef.current.value ="";


            setComment(""); setSuccess(true); setHasUsedCache(true);
            setTimeout(() => setSuccess(null), 2000);

        } else {
            setRetry(true);
        };
        setLoading(false);
    };


    return (
        <div className={`fixed bottom-0 left-0 bg-[rgba(10,10,10,1)] border-t border-gray-900/60 min-h-[70px] w-full flex flex-row justify-between gap-2 p-2 ${focused ? "":className}`}>
            <div className="absolute flex flex-col min-w-40 text-sm max-h-40 bg-[rgb(15,15,15)] bottom-[105%] rounded-lg overflow-y-scroll">
                {suggestions.map((name, i) => (<div onClick={() => {setComment(`@${name} `); commentRef.current.focus()}} className="border-b border-white/20 p-2" key={i}>
                    @{name}
                </div>))}
            </div>
            <div className="w-full rounded-lg bg-black border border-gray-900/60">
                <textarea onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onInput={
                    (e) => {
                        const el = e.target;
                        el.style.height = "auto";
                        const lineHeight = parseInt(window.getComputedStyle(el).lineHeight);
                        const maxHeight = lineHeight * 5 //5 is the rwo limit
                        const newHeight = el.scrollHeight;
                        el.style.height = `${Math.min(newHeight, maxHeight)}px`
                    }
                } ref={commentRef} value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} className={`resize-none relative bottom-0 w-full h-full outline-none p-1 pl-2 ${loading ? "pointer-events-none":"pointer-events-auto"}`} placeholder="Try ghosting"></textarea>
            </div>
            <div className="relative rounded-lg flex-grow-1 flex flex-col items-center justify-center bg-[#5a0019ff] w-[15%] bottom-0">
                {(comment.trim().length > 1) && <>{loading ? <ClipLoader color="white" size={25}/>:<>{retry ? <RefreshCcw size={30} onClick={handleComment}/>:<Ghost size={30} onClick={handleComment}/>}</>}</>}
                {success && <CheckCircle size={30}/>}
            </div>
        </div>
    )
};