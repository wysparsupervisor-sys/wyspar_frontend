"use client";
import { ArrowLeft, HatGlasses, PackageOpen, RefreshCcw, ScanSearch, Sparkle, Telescope, UserRoundSearch } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ClickEffect from "../../components/effects/click-effect";
import { useRouter } from "next/navigation";
import Request from "../../lib/utils/request";
import { PuffLoader } from "react-spinners";
import UserSearchResultBody from "./local_comps/types/user_body";
import PostBody from "../../components/post_body";
import { useSearchStore } from "./local_comps/stores/search";
import StarsBackground2 from "../../components/animated_backgrounds/stars2";
import ExpiryWarning from "../../components/micellanious/expired-warning";
import { Virtuoso } from "react-virtuoso";

export default function Search(){
    const posts = useSearchStore((state) => state.posts[state.postCategory]) || [];
    const addScrollPosts = useSearchStore((state) => state.addScrollPosts);
    const profiles = useSearchStore((state) => state.profiles);
    const addProfiles = useSearchStore((state) => state.addProfiles);

    const router = useRouter();
    const searchQueryRef = useRef(null);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchType, setSearchType] = useState("wysparer");
    const [pageState, setPageState] = useState("atSearch");
    const [failed, setFailed] = useState(false);

    //for intercetion observer
    const [hasMore, setHasMore] = useState(true);
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (searchQueryRef.current && pageState === "atSearch") {
            searchQueryRef.current.value = "";
            setSearchText("");
        };
    }, [searchType]);

    useEffect(() => {
        setHasMore(true);
        useSearchStore.setState({ profiles: [] });
        useSearchStore.setState({ posts: {} });
    }, [searchText]);

    const QuerySearch = async () => {
        setFailed(false);
        if (!hasMore) return;

        const params = new URLSearchParams({ })
        if (searchType === "wysparer"){
            const lastItem = profiles[profiles.length - 1];
            if (lastItem) params.append("lastItemRankProp", lastItem.dist_score);
        } else {
            const lastItem = posts ? posts[posts.length - 1] : null;
            if (lastItem) params.append("lastItemRankProp", lastItem.distance);
        };

        setLoading(true);
        const searchQuery = searchText.trim().replace(/\s+/g, "+");
        const res = await Request(`/app/search?search_type=${searchType}&search_query=${searchQuery}&${params}`, "GET");

        if (res.cause && res.cause === "nosub") {
            setIsExpired(true);
        } else if (res.body && !res.body.length) {
            setHasMore(false);
        } else if (res.ok) {
            if(searchType ==="wysparer") addProfiles(res.body);
            if(searchType ==="whisper") addScrollPosts(res.body);
        } else {
            setFailed(true);
        };

        setLoading(false);
    };

    return (
        <div className="w-full h-full">
            {pageState === "atSearch" && <div className="flex flex-col items-center gap-1">
                <StarsBackground2/>
                <div className="w-full flex flex-row items-center p-2 gap-1">
                    <div><ClickEffect><ArrowLeft onClick={() => router.back()} className="flex-shrink-0"/></ClickEffect></div>
                    <input defaultValue={searchText} ref={searchQueryRef} maxLength={searchType === "wysparer" ? "15":"50"} onInput={(e) => { setSearchText(e.target.value); if(searchType !== "wysparer") return; e.target.value = e.target.value.replace(/\s/g, '');}} type="text" className={`w-full p-2 pl-4 bg-[rgb(15,15,15)] rounded-2xl outline-none ${loading && "pointer-events-none"}`} placeholder="Search"/>
                    {searchText.trim().length > 2 && <div className={`${loading && "pointer-events-none"}`}><ClickEffect><Telescope onClick={() => { setPageState("atResult"); QuerySearch();}} className="flex-shrink-0"/></ClickEffect></div>}
                </div>
                <div className="flex flex-row gap-3 text-sm">
                    <b onClick={() => setSearchType("wysparer")} className={`p-1 bg-[#000030] rounded-xl pl-4 pr-4 flex flex-row items-center gap-2 transition-all duration-300 border-2 ${loading && "pointer-events-none"} ${searchType === "wysparer" ? "border-white":"border-transparent"}`}><UserRoundSearch color="cyan"/>wysparer</b>
                    <b onClick={() => setSearchType("whisper")} className={`p-1 bg-[#000030] rounded-xl pl-4 pr-4 flex flex-row items-center gap-2 transition-all duration-300 border-2 ${loading && "pointer-events-none"} ${searchType === "whisper"? "border-white":"border-transparent"}`}><ScanSearch color="red"/>whisper</b>
                </div>
                <div className="h-full w-full p-5 pt-7">
                    <div className="text-gray-300 p-2 text-center rounded-lg text-sm">
                        {searchType === "wysparer" && "Search for a user by typing their name. Click the other button to search for a post."}
                        {searchType === "whisper" && "Search for a post by typing related words or hashtag. Click the other button to search for people."}
                    </div>
                </div>
            </div>}

            {pageState === "atResult" && <div className="flex flex-col h-full">
                
                {searchType ==="wysparer" && <Virtuoso increaseViewportBy={{top: 200, bottom: 200}} endReached={() => QuerySearch()} data={profiles} itemContent={(i, info) => <div key={i}><UserSearchResultBody info={info}/></div>}
                    components={{
                        Footer: () => <div className="flex flex-col text-gray-300 items-center justify-center p-5">
                            {!isExpired && <div>
                                {hasMore && !failed ? <>
                                    {loading && <div className="flex flex-col items-center gap-2">
                                        <p>Finding....</p>
                                        <PuffLoader color="white" size={150}/>
                                    </div>}
                                </>:<>{!failed ? <p className="flex flex-col h-70 items-center gap-1">
                                        <PackageOpen size={80}/>    
                                        <span>Nothing relevant from here</span>
                                    </p>:<div className="flex flex-col h-70 items-center gap-1">
                                        <RefreshCcw onClick={QuerySearch} size={50}/>
                                        <span>Something went wrong!</span>
                                    </div>}</>
                                }
                            </div>}
                            {isExpired && <div>
                                <ExpiryWarning/>
                            </div>}
                        </div>,
                        Header: () => <div className="flex flex-row items-center p-2 gap-3">
                            <ArrowLeft onClick={() => setPageState("atSearch")} size={30} className="flex-shrink-0"/>
                            <div className="flex-grow-0 flex flex-row items-center justify-center gap-2 p-1 bg-[#000010] border border-gray-900/50 rounded-xl w-full">
                                <HatGlasses size={20} className="flex-shrink-0"/>
                                <div className="text-gray-300 truncate max-w-[150]">{searchText}</div>
                                <Sparkle size={20} className="flex-shrink-0"/>
                            </div>
                            {searchType === "wysparer" ? <UserRoundSearch size={30} className="flex-shrink-0"/>:<ScanSearch size={30} className="flex-shrink-0"/>}
                        </div>
                    }}
                />}
                {searchType === "whisper" && <Virtuoso increaseViewportBy={{top: 200, bottom: 200}} endReached={QuerySearch} data={posts} itemContent={(i, post) => <PostBody store={useSearchStore} key={post.post_id} info={post}/>}
                    components={{
                        Footer: () => <div className="flex flex-col text-gray-300 items-center justify-center p-5">
                            {!isExpired && <div>
                                {hasMore && !failed ? <>
                                    {loading && <div className="flex flex-col items-center gap-2">
                                        <p>Finding....</p>
                                        <PuffLoader color="white" size={150}/>
                                    </div>}
                                </>:<>{!failed ? <p className="flex flex-col h-70 items-center gap-1">
                                        <PackageOpen size={80}/>    
                                        <span>Nothing relevant from here</span>
                                    </p>:<div className="flex flex-col h-70 items-center gap-1">
                                        <RefreshCcw onClick={() => setFailed(false)} size={50}/>
                                        <span>Something went wrong!</span>
                                    </div>}</>
                                }
                            </div>}
                            {isExpired && <div>
                                <ExpiryWarning/>
                            </div>}
                        </div>,
                        Header: () => <div className="flex flex-row items-center p-2 gap-3">
                            <ArrowLeft onClick={() => setPageState("atSearch")} size={30} className="flex-shrink-0"/>
                            <div className="flex-grow-0 flex flex-row items-center justify-center gap-2 p-1 bg-[#000010] border border-gray-900/50 rounded-xl w-full">
                                <HatGlasses size={20} className="flex-shrink-0"/>
                                <div className="text-gray-300 truncate max-w-[150]">{searchText}</div>
                                <Sparkle size={20} className="flex-shrink-0"/>
                            </div>
                            {searchType === "wysparer" ? <UserRoundSearch size={30} className="flex-shrink-0"/>:<ScanSearch size={30} className="flex-shrink-0"/>}
                        </div>
                    }}
                />}
            </div>}
        </div>
    );
};