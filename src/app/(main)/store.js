"use client";
import { create } from "zustand";

export const useScrollStore = create((set) => ({
    scrollListen: null,
    setScrollListen: (ref) => set({ scrollListen: ref }),
}));