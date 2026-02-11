"use cliient";
import Request from "@/app/lib/utils/request";
import { useFeedStore } from "../stores/feed";
import React, { useEffect, useRef, useState } from "react";
import PostBody from "@/app/components/post_body";
import { PropagateLoader } from "react-spinners";
import { RefreshCcw, Ship } from "lucide-react";
import ExpiryWarning from "@/app/components/micellanious/expired-warning";
import { Virtuoso } from "react-virtuoso";
import Section1 from "./section1";
import { useScrollStore } from "@/app/(main)/store";
import ClickEffect from "@/app/components/effects/click-effect";

const MemoHeader = React.memo(() => <Section1/>);


export default function Section2(){
    const posts = useFeedStore((state) => state.posts[state.postCategory]) || [];
    const addScrollPosts = useFeedStore((state) => state.addScrollPosts);
    const postCategory = useFeedStore((state) => state.postCategory);
    const hasMore = useFeedStore((state) => state.hasMore);
    const setScrollListen = useScrollStore((state) => state.setScrollListen);
    const setHasMore = useFeedStore((state) => state.setHasMore);

    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const virtuosoRef = useRef(null);

    useEffect(() => {
        if(!virtuosoRef.current) return;
        setScrollListen(virtuosoRef);
    }, [setScrollListen]);

    //when post category changes also make failed false
    useEffect(() => {
        fetchFeed();
        setFailed(false);
    }, [postCategory]);

    async function fetchFeed(hasMore_loc = hasMore) {
        if(!hasMore_loc) return;
        setFailed(false); setLoading(true);
        const res = await Request(`/app/feed?post_category=${postCategory}`, "GET");
        if (!res.ok) {
            setFailed(true);
        };
        if (res.cause && res.cause === "nosub"){
            if (hasMore_loc) setHasMore(false);
        };
        if (res.body && res.body.length > 0) {
            if(!hasMore_loc) setHasMore(true);
            addScrollPosts(res.body);
        };
        setLoading(false);
    };

    const RefreshFeed = () => {
        useFeedStore.setState({ posts: [] });
        setHasMore(true);
        fetchFeed(true);
    };

    return (
        <div className="flex flex-col gap-3 h-full">
            <Virtuoso increaseViewportBy={{top: 200, bottom: 200}} scrollerRef={(el) => virtuosoRef.current = el} endReached={() => fetchFeed()} data={posts} itemContent={(i, post) => <PostBody store={useFeedStore} key={post.post_id+i} info={post}/>}
                components={{
                    Footer: () => <div>
                        {hasMore && <div className="relative flex flex-col text-gray-300 items-center justify-center p-5">
                            {loading && <PropagateLoader color="white" className="mb-4"/>}
                            {failed && <div className="flex flex-col items-center justify-center gap-5 text-sm">
                                <RefreshCcw size={50} onClick={fetchFeed}/>
                                <span>Something went wrong. Retry!</span>
                            </div>}
                        </div>}
                        {/*since we only use  has oore for subscription we can do this*/}
                        {!hasMore && <ExpiryWarning/>}
                    </div>,
                    Header: MemoHeader,
                }}
            />
            <div onClick={RefreshFeed} className="opacity-90 fixed z-1 bottom-22 right-7 p-2 bg-black border-2 border-gray-900 rounded-full"><ClickEffect><Ship size={20}/></ClickEffect></div>
        </div>
    );
};