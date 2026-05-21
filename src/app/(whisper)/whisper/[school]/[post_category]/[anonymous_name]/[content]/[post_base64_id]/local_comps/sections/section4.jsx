import { Heart, MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";
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
        <div className="flex flex-row items-center justify-between bg-[rgba(5,5,30,1)]/80 border-2 border-red-900/15 pt-1.5 pb-1.5 pl-5 pr-5 text-sm text-gray-400 rounded-2xl">
            <div className={baseStyle}>
                <ClickEffect><ThumbsUp onClick={() => {setVotedFunc(1)}} strokeWidth={2} size={20} color={vote_value === 1 ? "greenyellow" : "white"}/></ClickEffect>
                {millify(total_upvote, {precision: 1})}
            </div>
            <div className={baseStyle}>
                <ClickEffect><ThumbsDown onClick={() => {setVotedFunc(-1)}} strokeWidth={2} size={20} color={vote_value === -1 ? "red" : "white"}/></ClickEffect>
                {millify(total_downvote, {precision: 1})}
            </div>
            <div className={baseStyle}>
                <ClickEffect><Heart onClick={() => setLovedFunc()} strokeWidth={2} size={20} color={love_value === 1 ? "white" : "white"} fill={love_value === 1 ? "white":""}/></ClickEffect>
                {millify(total_love, {precision: 1})}
            </div>
            <div className={baseStyle}>
                <ClickEffect><MessageCircle onClick={() => setPostStates(c => produce(c, draft => { draft.isCommenting = true }))} strokeWidth={1.5} size={20} color="white"/></ClickEffect>
                {millify(total_comment, {precision: 1})}
            </div>
        </div>
    );
};