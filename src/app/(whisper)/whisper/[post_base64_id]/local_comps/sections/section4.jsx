import { FlagTriangleLeft, FlagTriangleRight, Ghost, Heart } from "lucide-react";
import { updateInteraction } from "@/app/services/interaction";
import ClickEffect from "@/app/components/effects/click-effect";
import { useState } from "react";
import millify from "millify";


export default function Section4({info}){
    const { post_id }  = info;
    let { total_upvote, total_downvote, total_love, total_comment } = info;
    const [love_value, setLoveValue] = useState(info.love_value);
    const [vote_value, setVoteValue] = useState(info.vote_value);
    const baseStyle = "flex flex-row items-center gap-1";


    const setVotedFunc = (val) => {
        const new_state = vote_value === val ? 0 : val;
        setVoteValue(new_state);
        updateInteraction(post_id, "vote", new_state);
    };

    const setLovedFunc = () => {
        const new_state = love_value === 1 ? 0 : 1;
        setLoveValue(new_state);
        updateInteraction(post_id, "love", new_state);
    };
   

    return (
        <div className="flex flex-row items-center justify-between bg-[rgba(0,0,39,1)]/80 border border-gray-900/70 pt-1 pb-1 pl-3 pr-3 text-sm text-gray-400 rounded-lg">
            <div className={baseStyle}>
                <ClickEffect><FlagTriangleRight onClick={() => {setVotedFunc(1)}} strokeWidth={1.5} size={17} color={vote_value === 1 ? "greenyellow" : "white"} fill={vote_value === 1 ? "greenyellow":""}/></ClickEffect>
                {millify(total_upvote, {precision: 1})}
            </div>
            <div className={baseStyle}>
                <ClickEffect><FlagTriangleLeft onClick={() => {setVotedFunc(-1)}} strokeWidth={1.5} size={17} color={vote_value === -1 ? "red" : "white"} fill={vote_value === -1 ? "red":""}/></ClickEffect>
                {millify(total_downvote, {precision: 1})}
            </div>
            <div className={baseStyle}>
                <ClickEffect><Heart onClick={() => setLovedFunc()} strokeWidth={1.5} size={17} color={love_value === 1 ? "cyan" : "white"} fill={love_value === 1 ? "cyan":""}/></ClickEffect>
                {millify(total_love, {precision: 1})}
            </div>
            <div className={baseStyle}>
                <ClickEffect><Ghost strokeWidth={1.5} size={17} color="white"/></ClickEffect>
                {millify(total_comment, {precision: 1})}
            </div>
        </div>
    );
};