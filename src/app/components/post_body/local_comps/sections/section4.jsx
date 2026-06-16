import { Laugh, MessageCircle, ThumbsDown, ThumbsUp } from "lucide-react";
import ClickEffect from "../../../effects/click-effect";
import { usePostViewContext } from "../../context";
import { produce } from "immer";
import { updateInteraction } from "@/app/services/interaction";
import millify from "millify";


export default function Section4({info}){
    const { postStates, setPostStates } = usePostViewContext();
    const updateVoteCounter = postStates.Store((state) => state.updateVoteCounter);
    const updateLoveCounter = postStates.Store((state) => state.updateLoveCounter);
    const { post_id }  = info;
    const { total_upvote, total_downvote, total_love, total_comment, love_value, vote_value } = postStates.Store((state) => state.posts[state.postCategory]?.find(p => p.post_id === post_id)) || [];
    const baseStyle = "flex flex-row items-center gap-1";


    const setVotedFunc = (val) => {
        const new_state = vote_value === val ? 0 : val;
        updateInteraction(post_id, "vote", new_state);

        //update post counter
        updateVoteCounter(new_state, post_id);
    };

    const setLovedFunc = () => {
        const new_state = love_value === 1 ? 0 : 1;
        updateInteraction(post_id, "love", new_state);

        //update counter locally for optimistic ui
        updateLoveCounter(new_state, post_id);
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
                <ClickEffect><Laugh onClick={() => setLovedFunc()} strokeWidth={2} size={20} color={love_value === 1 ? "yellow" : "white"}/></ClickEffect>
                {millify(total_love, {precision: 1})}
            </div>
            <div className={baseStyle}>
                <ClickEffect><MessageCircle onClick={() => setPostStates(c => produce(c, draft => { draft.isCommenting = true }))} strokeWidth={1.5} size={20} color="white"/></ClickEffect>
                {millify(total_comment, {precision: 1})}
            </div>
        </div>
    );
};