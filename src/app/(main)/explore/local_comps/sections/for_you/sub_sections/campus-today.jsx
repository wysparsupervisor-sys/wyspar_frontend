"use client";
import { useScrollStore } from "@/app/(main)/store";
import { Dot, PackageOpen, RefreshCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import PostBody from "@/app/components/post_body";
import { PropagateLoader } from "react-spinners";
import { Virtuoso } from "react-virtuoso";
import { useCampusTodayStore } from "../../../stores/campus-today";
import Request from "@/app/lib/utils/request";
import { useWorkShopStore } from "@/app/components/layout/store";
import UpdateAlert from "../local_comps/update-alert";

export default function CampusToday(){    
    const dayStart = useCampusTodayStore((state) => state.dayStart);
    const dayEnd = useCampusTodayStore((state) => state.dayEnd);
    const updateDaysBack = useCampusTodayStore((state) => state.updateDaysBack);
    const daysBack = useCampusTodayStore((state) => state.daysBack);

    const setHidden = useScrollStore(state => state.setHidden);

    const setWorkShopState = useWorkShopStore(state => state.setWorkShopState);
    const posts = useCampusTodayStore(state => state.posts["all"]) || [];
    let posts_filtered = posts.filter(post => {
        const post_num = new Date(post.created_at).getTime();
        return post_num >= new Date(dayStart).getTime() && post_num < (daysBack === 0 ? Date.now() : new Date(dayEnd).getTime())
    }); 
    const addScrollPosts = useCampusTodayStore(state => state.addScrollPosts);
    const addNewPosts = useCampusTodayStore(state => state.addNewPosts);
    const setScrollListen = useScrollStore((state) => state.setScrollListen);
    const virtuosoRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [failed, setFailed] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    const containerRef = useRef(null);
    useEffect(() => {
        if(!virtuosoRef.current) return;
        setScrollListen(virtuosoRef);
    }, [setScrollListen]);

    useEffect(() => {
        setHidden(false);
        containerRef.current?.scrollTo({ top: 0 });
        setHasMore(true);
        fetchFeed(true);
        setFailed(false);
    }, [daysBack]);

    const fetchFeed = async (force = false) => {  
        if(!hasMore && !force) return;      
        setLoading(true);
        const lastPost = posts_filtered[posts_filtered.length - 1];
        const params = new URLSearchParams({ });

        params.append("day_start", dayStart);
        params.append("day_end", dayEnd);
        if(lastPost) params.append("lastPostTimestamp", lastPost.created_at);

        const res = await Request(`/app/feed?action=time&${params}`, "GET");
        if (!res.ok) {
            setFailed(true);
        } else if (res.body && res.body.length > 0) {            
            addScrollPosts(res.body);
        } else if (res.body.length === 0){
            setHasMore(false);
        };
        setLoading(false);
    };


    //fetch new posts every two minutes
    const [firstItemIndex, setFirstItemIndex] = useState(50000);
    const [updateAlert, setUpdateAlert] = useState(null);
    const postRef = useRef(posts);
    //keep syncing ref
    useEffect(() => {
        postRef.current = posts;
    }, [posts]); 

    async function GetNewPosts(){        
        const firstTimestamp = postRef.current[0]?.created_at || dayStart;
        const res = await Request(`/app/feed?action=new&first_timestamp=${firstTimestamp}`, "GET");
        if(!res.ok) return;
        if(!res.body.length) return;
        if(res.body.length === 1 && res.body[0].created_at === firstTimestamp) return;
        addNewPosts(res.body);
        setUpdateAlert(res.body.length - 1);
        setFirstItemIndex(prev => prev - (res.body.length - 1));      
    };
    useEffect(() => {
        const fetchNew = setInterval(GetNewPosts, 1000 * 60);

        return () => clearInterval(fetchNew);
    }, []);


    return (
        <>
            <Virtuoso ref={containerRef} initialTopMostItemIndex={0} firstItemIndex={firstItemIndex} increaseViewportBy={{top: 200, bottom: 200}} scrollerRef={(el) => virtuosoRef.current = el} endReached={() => fetchFeed()} data={posts_filtered} itemContent={(i, post) => <PostBody store={useCampusTodayStore} key={post.post_id+i} info={post}/>}
                components={{
                    Header: () => <div>
                        {daysBack != 0 && <div>
                            <button onClick={() => { updateDaysBack(0);}} className="flex items-center justify-center bg-[rgb(20,20,20)] w-full text-center text-sm border-2 border-gray-500">Go to current day <Dot size={30} color="greenyellow" style={{transform: "Scale(2)"}}/></button>
                        </div>}
                        {!posts_filtered.length && !hasMore && <div className="opacity-70 flex flex-col items-center justify-center h-40 pl-15 pr-15 text-center">
                            <span>{daysBack === 0 ? "Posts are yet to come? Be the first to be seen!":"no posts on this day 😪"}</span>                                                   
                        </div>}
                    </div>,
                    Footer: () => <div>
                        {hasMore && <div className="relative flex flex-col text-gray-300 items-center justify-center p-5">
                            {loading && <PropagateLoader color="white" className="mb-4"/>}
                            {failed && <div className="flex flex-col items-center justify-center gap-5 text-sm">
                                <RefreshCcw size={50} onClick={fetchFeed}/>
                                <span>Something went wrong. Retry!</span>
                            </div>}
                        </div>}
                        {/*since we only use  has oore for subscription we can do this*/}
                        {!hasMore && <div className="text-center mt-5 flex flex-col items-center">
                            
                            <span className="w-70 mb-1 text-gray-400">What's your take on campus today?</span>
                            <div className="flex items-center gap-2">                            
                                <button className="bg-[blue]/20 w-50 p-2 rounded-full" onClick={() => setWorkShopState("post")}>Post it</button>
                            </div>  

                            {!(daysBack >= 5) && <div className="flex items-center gap-2 mt-1">
                                <button onClick={() => { updateDaysBack(daysBack + 1); posts_filtered = []}} className="bg-[#5a0019ff]/40 p-2 w-50 rounded-full">See Yesterday {daysBack + 1}</button>
                            </div>  }                          
                            <div className="h-100"></div>                          
                        </div>}
                    </div>,                        
                }}
            />
            <UpdateAlert updateAlert={updateAlert} setUpdateAlert={setUpdateAlert} containerRef={containerRef}/>
        </>
    )
} 