"use client";

import { produce } from "immer";
import { create } from "zustand";

//function for getting start and end date
const getExperiencedTimestamp = (daysBack = 0, isEnd = false) => {
    const now = new Date();

    //if we're looking for end of today
    if(isEnd && daysBack === 0) return now.toISOString();

    const date = new Date(now);

    //apply the 3am night owl rule!
    if(now.getHours() < 3) {
        date.setDate(date.getDate() - 1);
    };

    //subtract extra days for history
    date.setDate(date.getDate() - daysBack);

    //if it's the end of a past day, it's actually the start of the day after it
    if (isEnd) {
        date.setDate(date.getDate() + 1);
    };

    //set 3AM local
    date.setHours(3, 0, 0, 0);

    return date.toISOString();
};

export const useCampusTodayStore = create((set) => ({
    posts:{},
    forYouState: "campus-today",
    changeForYouState: (val) => set({ forYouState: val }),
    dayStart: getExperiencedTimestamp(0),
    dayEnd:getExperiencedTimestamp(0, true),
    daysBack: 0,
    updateDaysBack: (num) => {
        const newStart = getExperiencedTimestamp(num);
        const newEnd = getExperiencedTimestamp(num, true);

        set({
            daysBack: num,
            dayStart: newStart,
            dayEnd: newEnd,
        })
    },
    addNewPosts: (newPosts) => set((state) => {
        const new_arr = [ ...newPosts, ...(state.posts[state.postCategory] || []) ];
        const unique = Array.from(new Map(new_arr.map(post => [post.post_id, post])).values())
        const updated =  { ...state.posts, [state.postCategory]: unique }
        return { posts: updated }
    }),
    postCategory: "all",
    updatePostCategory: (cat) => set({ postCategory: cat }),
    posts: {},
    addScrollPosts: (newPosts) => set((state) => {
        const updated = { ...state.posts, ["all"]: [...(state.posts[state.postCategory] || []), ...newPosts] };
        return { posts: updated }
    }),
    updateVoteCounter: (new_vote, post_id) => set(produce((state) => {
        const post = state.posts[state.postCategory].find((p) => p.post_id === post_id);
        const previous_vote = post.vote_value;

        post.vote_value = new_vote;
        const deltaUp = (new_vote === 1 ? 1 : 0) - (previous_vote === 1 ? 1 : 0);
        const deltaDown = (new_vote === -1 ? 1 : 0) - (previous_vote === -1 ? 1 : 0);

        post.total_upvote += deltaUp;
        post.total_downvote += deltaDown;
    })),
    updateLoveCounter: (new_love, post_id) => set(produce((state) => {
        const post = state.posts[state.postCategory].find((p) => p.post_id === post_id);
        post.love_value = new_love;
        if(new_love === 1) {  //user loved
            post.total_love += 1;
        } else { //user unloved
            post.total_love -= 1;
        };
    })),
    updateCommentCounter: (count=1, post_id="") => set(produce((state) => {
        const post = state.posts[state.postCategory].find((p) => p.post_id === post_id);
        post.total_comment += count;
    })),
}));