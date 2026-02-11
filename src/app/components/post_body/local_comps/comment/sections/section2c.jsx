import Request from "@/app/lib/utils/request";
import { createAvatar } from "@dicebear/core";
import * as Collection from "@dicebear/collection";
import { Calendar1, ChevronDown, ChevronUp, Ghost, RefreshCcw, Slash, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ClipLoader, PropagateLoader } from "react-spinners";
import TimeAgo from "@/app/lib/utils/time-ago";
import { Inter } from "next/font/google";
import { useCommentsStore } from "../stores/comments";
import { GetFromSessionStorage } from "@/app/lib/utils/session-storage";
import { produce } from "immer";
import Link from "next/link";
import { FRONTEND_URL } from "../../../../../../../domain";
import { useUserStore } from "@/app/(main)/me/profile/local_comps/stores/user";
import ExpiryWarning from "@/app/components/micellanious/expired-warning";

//font
const inter = Inter({subsets: ["latin"], variable: "--font-inter", weight: ["400"]});
function ReplyHead({details, info}){
    const profile =  useUserStore((state) => state.profile);
    const [dataUri, setDataUri] = useState("/logo.png");
    const [isSliced, setIsSliced] = useState(true);
    const { anonymous_name, comment, avatar, created_at, school, comment_id } = details;
    const [showDelete, setShowDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (!avatar) return;
        setDataUri(createAvatar(Collection[avatar.style], { seed: avatar.seed }).toDataUri());
    }, [avatar]);

    const handleDelete = async () => {
        setLoading(true); setFailed(false);
        const res = await Request("/app/user/me/delete/comment", "POST", { comment_id: comment_id });
        if (!res.ok) {
            setFailed(true);
        } else {
            useCommentsStore.setState(produce((state) => {
                const index = state.commentGroups[info.post_id].findIndex((c) => c.comment_id = comment_id);
                state.commentGroups[info.post_id].splice(index, 1);
            }));
        };

        setLoading(false);
    };

    return (
        <div className="relative flex flex-row gap-1 flex-grow-0 flex-stretch-0">
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
                {showDelete ? <div className="h-10 w-10 border border-gray-900 rounded-full flex flex-col items-center justify-center">
                    {!loading && !failed && <Trash2 onClick={handleDelete} color="orangered"/>}
                    {loading && !failed && <ClipLoader size={20} color="white"/>}
                    {failed && !loading && <RefreshCcw onClick={handleDelete} size={20}/>}
                </div>:<Image src={dataUri} height={50} width={50} alt="commenter profile" className="rounded-full bg-white/90 w-10 h-10 flex-stretch-0"/>}
                {(profile && profile.anonymous_name == anonymous_name) && <>
                    {showDelete ? <ChevronUp onClick={() => setShowDelete(false)} strokeWidth={2} size={20} className=""/>:<ChevronDown onClick={() => setShowDelete(true)} strokeWidth={2} size={20} className=""/>}
                </>}
            </div>
            <div className="relative">
                <span className="flex flex-row gap-1 items-center border border-gray-900/60 p-1 pl-3 pr-3 rounded-full text-[10px]"><Link href={FRONTEND_URL + "/wysparers/" + encodeURIComponent(anonymous_name)}><span>@{anonymous_name}</span></Link> <span>{school.toUpperCase()}</span>  {TimeAgo(created_at)}</span>
                <span className={`${inter} break-all inline-block min-w-30 min-h-5 bg-[#000020] rounded-xl pl-3 p-2 mt-1 text-gray-200`}>{isSliced ? comment.slice(0,100):comment} {comment.slice(0,100).length !== comment.length && <>{isSliced ? <b className="font-semibold text-white" onClick={() => setIsSliced(false)}>...Peak</b>:<b onClick={() => setIsSliced(true)} className="font-semibold text-white">Peak less</b>}</>}</span>
            </div>
        </div>
    )
}



export default function Section2C({info}){
    const loaderRef = useRef(null);
    const [displayState, setDisplayState] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const createCommentGroup = useCommentsStore((state) => state.createCommentGroup);
    const commentsSource = useCommentsStore((state) => state.commentGroups[info.post_id]);
    const addCommentsToGroup = useCommentsStore((state) => state.addCommentsToGroup);
    const hasUsedCache = useCommentsStore((state) => state.hasUsedCache);
    const setHasUsedCache = useCommentsStore((state) => state.setHasUsedCache);
    const comments = commentsSource ?? [];

    useEffect(() => {
        createCommentGroup(info.post_id);
    }, [info.post_id, createCommentGroup]);



    const fetchPosts = async () => {
        if (loading || !hasMore) return;

        //check if their are already comments in cache
        const cached = GetFromSessionStorage("comment-groups");
        if (cached && cached[info.post_id] && !hasUsedCache) {
            useCommentsStore.setState(produce((state) => {
                state.commentGroups[info.post_id] = cached[info.post_id];
            }));
            setLoading(false);
            return setHasUsedCache(true);
        } else {

            //incase cached has expired and that first if line didnt go on we need assume cache has been used unless the next batch will use it
            setHasUsedCache(true);
            
            //get timestamp index of last created at
            const lastComment = comments[comments.length - 1];
            const params = new URLSearchParams({ })
            if (lastComment){
                params.append("lastCreatedAt", lastComment.created_at);
            };
        
            setLoading(true);
            const res = await Request(`/app/post/comment/get?post_id=${info.post_id}&${params}`, "GET");
            if (res.cause && res.cause === "nosub"){
                setDisplayState("nosub");
                setHasMore(false);
            } else if (res.body.length === 0) {
                setHasMore(false);
            } else {
                const new_comments = res.body;
                addCommentsToGroup(info.post_id, new_comments);
            };

            setLoading(false);
        };
    };

    useEffect(() => {
        if(!loaderRef.current) return;

        //run on first time if comments is empty (adding this because of a bug i noticed) for some reason inside our post comment section whenever browser nav is their it doesnt run intersction observer
        if (comments.length === 0) fetchPosts();


        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                if(comments.length != 0) fetchPosts();
            }
        }, {
            root: null, //viewport
            rootMargin: "400px", //prefetch before hitting bottom
            threshold: 0,
        });

        observer.observe(loaderRef.current);

        return () => observer.disconnect()
    }, [hasMore, comments]);


    return (
        <div className="mt-2 border-t border-gray-900 p-3 pt-3">
            <p className="text-lg flex flex-row items-center gap-2"><Ghost/> Ghosts</p>
            <div className="flex flex-col gap-5 mt-5">
                {comments.map((details) => (
                    <ReplyHead key={details.comment_id} info={info} details={details}/>
                ))}

                {displayState === "nosub" && <ExpiryWarning/>}  

                {/**intersection observer*/}
                {displayState !== "nosub" && <div className="flex flex-col text-gray-300 items-center justify-center pb-5">
                    {hasMore ? <>
                        <div ref={loaderRef}></div>
                        {loading  && <PropagateLoader color="white"/>}
                    </>:<div className="flex flex-col items-center gap-3">
                        <div className="relative">
                            <Ghost size={70} className="relative top-0 left-0"/>
                            <Slash size={80} className="absolute top-0 left-0"/>
                        </div>
                        No ghosts here
                    </div>}
                </div>}
                <div className="w-full h-[90px]">{/**compensate for the height taken up by text area at the bottom */}</div>
            </div>
        </div>
    );
};