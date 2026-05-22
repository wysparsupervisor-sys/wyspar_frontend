"use client";
import Section1 from "./local_comps/sections/section1";
import Section4 from "./local_comps/sections/near_you/section4";
import { useFeedStore } from "./local_comps/stores/feed";
import ForYouPage from "./local_comps/sections/for_you";
import ExploreConnect from "../connect/page";

export default function Explore(){
    const feedState = useFeedStore((state) => state.feedState);
    return (
        <div className="h-full overflow-hidden">
            <Section1/>
            {feedState === "for-you" && <ForYouPage/>}
            {feedState === "near-you" && <Section4/>}
            {feedState === "connect" && <ExploreConnect/>}
        </div>
    );
};