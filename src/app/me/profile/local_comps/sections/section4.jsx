"use client";
import PostBody from "@/app/components/post_body";
import { useUserStore } from "../stores/user";
import { GetFromSessionStorage } from "@/app/lib/utils/session-storage";
import React, { useEffect, useRef, useState } from "react";
import Request from "@/app/lib/utils/request";
import { PropagateLoader } from "react-spinners";
import { PackageOpen } from "lucide-react";
import Section1 from "./section1";
import Section2 from "./section2";
import Section3 from "./section3";
import { useScrollStore } from "@/app/store";
import { Virtuoso } from "react-virtuoso";

const MemoHeader = React.memo(() => <>
    <div className="bg-[rgba(13,13,14,1)]">
        <Section1/>
        <Section2/>
    </div>
    <Section3/>
</>);

export default function Section4(){
    const addScrollPosts = useUserStore((state) => state.addScrollPosts); //if post is in session storage then add
    const postCategory = useUserStore((state) => state.postCategory);
    const hasUsedCache = useUserStore((state) => state.hasUsedCache);
    const setHasUsedCache = useUserStore((state) => state.setHasUsedCache);
    const setScrollListen = useScrollStore((state) => state.setScrollListen);
    const posts = useUserStore((state) => state.posts[postCategory]) || [];
 
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const virtuosoRef = useRef(null);
    
    useEffect(() => {
        if(!virtuosoRef.current) return;
        setScrollListen(virtuosoRef);
    }, [setScrollListen]);

    //when post category changes then reset hasMore
    useEffect(() => {
        //correctly reset all states during category change to avoid issues
        setHasMore(true);
        setLoading(false);
        fetchPosts(false, true);
    }, [postCategory]);

    //function to fetch more posts as user gets closer to intersection object
    const fetchPosts = async (loading_loc=loading, hasMore_loc=hasMore) => {
        if (loading_loc || !hasMore_loc) return;
    
        setLoading(true);

        //check cache
        const cached = GetFromSessionStorage("user-posts");
        if (cached && cached[postCategory] && !hasUsedCache) {
            addScrollPosts(cached[postCategory]);
            setHasUsedCache(true);
            setLoading(false);
        } else {
            //incase cached has expired and that first if line didnt go on we need assume cache has been used unless the next batch will use it
            setHasUsedCache(true);

            const lastPost = posts[posts.length - 1];
            const params = new URLSearchParams({ });

            params.append("postCategory", postCategory);
            if(lastPost) {
                params.append("lastCreatedAt", lastPost.created_at);
            };

            const res = await Request(`/app/user/me/get?payload=get-posts&${params}`, "GET");
            if (res.body.length === 0) {
                setHasMore(false);
            } else {
                addScrollPosts(res.body);
            };

            setLoading(false);
        };
    };


    return (
        <div className="flex flex-col h-full">
            <Virtuoso increaseViewportBy={{top: 200, bottom: 200}} scrollerRef={(el) => virtuosoRef.current = el} endReached={() => fetchPosts()} data={posts} itemContent={(i, post) => <PostBody isUser={true} store={useUserStore} key={post.post_id} info={post}/>}
                components={{
                    Footer: () => <div className="flex flex-col text-gray-300 items-center justify-center p-5">
                        {hasMore ? <>
                            {loading && <PropagateLoader color="white"/>}
                        </>:<p className="flex flex-col h-70 items-center gap-1">
                            <PackageOpen size={80}/>
                            <span>Nothing Here</span>
                        </p>}
                    </div>,
                    Header: MemoHeader,
                }}
            />
        </div>
    );
};