"use client";
import StarsBackground from "../../animated_backgrounds/stars";
import { Calendar1, Check, HatGlasses, ImageUp, RefreshCcw, Send, X } from "lucide-react";
import { useEffect, useState } from "react";
import PostHeader from "./sections/header";
import PostFooter from "./sections/footer";
import StatementPost from "./types/statement";
import ArticlePost from "./types/article";
import { PostContext } from "./context";
import { produce } from "immer";
import Request from "@/app/lib/utils/request";
import UploadFileS3 from "@/app/lib/utils/upload-file-s3";
import { BarLoader, SyncLoader } from "react-spinners";
import { useUserStore } from "@/app/(main)/me/profile/local_comps/stores/user";
import ExpiryWarning from "../../micellanious/expired-warning";
import { useRouter, useSearchParams } from "next/navigation";




export default function MakePost({pageIsOPen}){
    const router = useRouter();
    const searchParams = useSearchParams();
    const addNewPosts = useUserStore((state) => state.addNewPosts);
    const setHasUsedCache = useUserStore((state) => state.setHasUsedCache);
    const setProfile = useUserStore((state) => state.setProfile);
    const [postingState, setPostingState] = useState(null);

    //clear  params imediately they visit page
    useEffect(() => {
        const url = new URL(window.location.href);
        url.searchParams.delete("type");
        url.searchParams.delete("content");
        url.searchParams.delete("category");
        url.searchParams.delete("isposting");

        router.replace(url.toString(), { scroll:false });
        
    }, []);

    const [data, setData] = useState({
        form: { 
            type: searchParams.get("type") || "article",
            text: decodeURIComponent(searchParams.get("content") || "") || "",
            style: "",
            category: searchParams.get("category") || "",
            images: [],
            coords: null,
        },
        temp: {
            images_object_url: [],
            location_status: null,
        },
    });

    //need this function so when changing post type everything is discarded
    const ResetState = () => {
        //reset evrything except coords cause they still remain same upon changing state
        setData(current => produce(current, draft => {
            draft.form.type = "article"; draft.form.text = "", draft.form.style = ""; draft.form.category = data.form.category; draft.form.images = [], draft.temp = { images_object_url: [], location_status: data.temp.location_status }
        }));
    };


    const SendPost = async () => {
        if(!data.form.category) return alert("Add a posting category 💎 At the top right of your screen! 🥤")
        const body = { type: data.form.type, text: data.form.text, category: data.form.category, coords: data.form.coords, style: data.form.style };
        
        //set posting true to block further interaction with ui and display certain animations
        setPostingState("sending");
        
        //seperate into different logics based on type
        if (body.type === "article" ) {
            if (data.form.images[0]) {
                //first get presigned url to upload image to S3
                const res1 = await Request(`/app/user/me/post?payload=article&withImage=true&action=presigned-url`, "POST", body);
                if(res1.cause && res1.cause === "notsub") return setPostingState("notsub")
                if(!res1.ok) return setPostingState("failed");

                setPostingState("uploading");
                const res2 = await UploadFileS3(res1.url, data.form.images[0]); //upload file to S3
                if(!res2.ok) return setPostingState("failed");

                //tell backend image has been sent (major design flaw to send body twice but even when we don't use it  in res1, but i put a valiadtion at route level so if i don't add it it won't go through. But hey at least it confuses attackers)
                const res3 = await Request(`/app/user/me/post?payload=article&withImage=true&action=post-article`, "POST", body);
                if(!res3.ok) return setPostingState("failed");

                //if we reached here then everything succeeded!!! add post to user posts store
                addNewPosts([res3.post_info]);
            } else {
                const res = await Request(`/app/user/me/post?payload=article&withImage=false`, "POST", body);
                if(res.cause && res.cause === "notsub") return setPostingState("notsub")
                if (!res.ok) return setPostingState("failed");

                addNewPosts([res.post_info]);
            };
        };
        
        if (body.type === "statement") {
            const res = await Request("/app/user/me/post?payload=statement", "POST", body);
            if(res.cause && res.cause === "notsub") return setPostingState("notsub");
            if (!res.ok) return setPostingState("failed");

            addNewPosts([res.post_info]);
        };

        //when the entire logic ends set timeout to navigate user out of the interface
        setPostingState("success");
        setHasUsedCache(true); //if user posts in another page first and had never visited profile then the post pretty much gonna apppply cache cause it's not beeen set as used 
        //if it's loaded yet add 1 to user total_post counter to improve local experience
        setProfile(produce(draft => { 
            if (draft.profile) draft.profile.stats.posts += 1;
        }));
        setTimeout(() => pageIsOPen(false), 2000);
    };

    return (
        <PostContext.Provider value={{data, setData}}>
            <div className="absolute w-full h-full max-h-[100dvh]">
                <div className="flex flex-col relative w-full h-full bg-black z-2">
                    <StarsBackground/>
                    <PostHeader pageIsOpen={pageIsOPen}/>
                    <div className="flex-grow-1 flex flex-col overflow-y-scroll">
                        {data.form.type == "article" && <ArticlePost/>}
                        {data.form.type == "statement" && <StatementPost/>}
                    </div>
                    <PostFooter resetFunc={ResetState}/>
                    {(data.form.text && data.temp.location_status && data.form.text.length >= 3) && <div onClick={SendPost} className="absolute right-5 bottom-[15%] p-3 bg-blue-900 rounded-full"><Send/></div>}
                </div>
                {postingState && <div className="absolute flex flex-col items-center justify-center top-0 left-0 bg-black/90 h-full w-full z-9">
                    <div className="flex flex-col gap-4 items-center">
                        {postingState == "sending" && <>
                            <HatGlasses size={80}/>
                            <p className="text-lg text-gray-200">Posting your Whisper...</p>
                            <SyncLoader color="white"/>
                        </>}
                        {postingState == "uploading" && <>
                            <ImageUp size={80}/>
                            <p className="text-lg text-gray-200">Uploading images...</p>
                            <SyncLoader color="white"/>
                        </>}
                        {postingState == "success" && <>
                            <Check size={80}/>
                            <p className="text-lg text-gray-200">Whisper Successful...</p>
                            <BarLoader color="white"/>
                        </>}
                        {postingState == "failed" && <>
                            <X className="absolute top-5 left-5" size={30} onClick={() => setPostingState(null)}/>
                            <RefreshCcw size={60} onClick={SendPost}/>
                            <p className="text-lg text-center text-gray-200">Something went wrong! <br/> Try again</p>
                        </>}
                        {postingState == "notsub" && <>
                            <X className="absolute top-5 left-5" size={30} onClick={() => setPostingState(null)}/>
                            <ExpiryWarning/>
                        </>}
                    </div>
                </div>}
            </div>
        </PostContext.Provider>
    );
};