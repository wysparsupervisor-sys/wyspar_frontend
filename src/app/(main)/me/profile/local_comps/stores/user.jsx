"use client";
import { SaveToSessionStorage } from "@/app/lib/utils/session-storage";
import { produce } from "immer";
import { create } from "zustand";

export const useUserStore = create((set) => ({
    profile: null,
    setProfile: (fn) => set(fn),
    
    postCategory: "all",
    updatePostCategory: (cat) => set({ postCategory: cat }),
    posts: {},
    hasUsedCache: false,
    setHasUsedCache: (bol) => set({ hasUsedCache: bol }),
    addNewPosts: (newPosts) => set((state) => {
        const updated = { ...state.posts, [state.postCategory]: [ ...newPosts, ...(state.posts[state.postCategory] || []) ] };
        SaveToSessionStorage("user-posts", updated, 1000 * 60 * 7); //practically just stay 7min
        return { posts: updated }
    }),
    addScrollPosts: (newPosts) => set((state) => {
        const updated = { ...state.posts, [state.postCategory]: [...(state.posts[state.postCategory] || []), ...newPosts] };
        SaveToSessionStorage("user-posts", updated, 1000 * 60 * 7); //practically just stay 7min
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

        //after all that update cache
        SaveToSessionStorage("user-posts", state.posts, 1000 * 60 * 5);
    })),
    updateLoveCounter: (new_love, post_id) => set(produce((state) => {
        const post = state.posts[state.postCategory].find((p) => p.post_id === post_id);
        post.love_value = new_love;
        if(new_love === 1) {  //user loved
            post.total_love += 1;
        } else { //user unloved
            post.total_love -= 1;
        };
        //after all that update cache
        SaveToSessionStorage("user-posts", state.posts, 1000 * 60 * 5);
    })),
    updateCommentCounter: (count=1, post_id="") => set(produce((state) => {
        const post = state.posts[state.postCategory].find((p) => p.post_id === post_id);
        post.total_comment += count;

        //after all that update cache
        SaveToSessionStorage("user-posts", state.posts, 1000 * 60 * 5);
    })),
}));