"use client";
import { produce } from "immer";
import { create } from "zustand";

export const useSearchStore = create((set) => ({
    profiles: [],
    addProfiles: (array) => set((state) => { return { profiles: [...state.profiles, ...array] } }),
    postCategory: "all",
    updatePostCategory: (cat) => set({ postCategory: cat }),
    posts: {},
    addScrollPosts: (newPosts) => set((state) => {
        const updated = { ...state.posts, [state.postCategory]: [...(state.posts[state.postCategory] || []), ...newPosts] };
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