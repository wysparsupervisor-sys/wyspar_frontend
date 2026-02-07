"use client";
import { SaveToSessionStorage } from "@/app/lib/utils/session-storage";
import { create } from "zustand";

export const useCommentsStore = create((set) => ({
    commentGroups: {},
    hasUsedCache: false,
    setHasUsedCache: (bol) => set({ hasUsedCache: bol }),
    addCommentsToGroup: (postId, comments) => set((state) => {
        const updated = {
            ...state.commentGroups,
            [postId]: [
                ...(state.commentGroups[postId] ?? []),
                ...comments,
            ],
        };
        SaveToSessionStorage("comment-groups", updated, 1000 * 60 * 10);
        return { commentGroups: updated }
    }),
    addNewCommentInGroup: (postId, comment) => set((state) => {
        const updated = {
            ...state.commentGroups,
            [postId]: [
                ...comment,
                ...(state.commentGroups[postId] ?? []),
            ],
        };
        SaveToSessionStorage("comment-groups", updated, 1000 * 60 * 10);
        return { commentGroups: updated }
    }),
    createCommentGroup: (postId) => set((state) => {
        if(state.commentGroups[postId]) return { commentGroups: { ...state.commentGroups } };
        const updated = Object.fromEntries(Object.entries({ [postId]: [], ...state.commentGroups }).slice(0, 15));
        SaveToSessionStorage("comment-groups", updated, 1000 * 60 * 10);
        return { commentGroups: updated }
    })
}));