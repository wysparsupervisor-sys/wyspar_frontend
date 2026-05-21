"use client";
import { create } from "zustand";

export const useWorkShopStore = create((set) => ({
    workShopState: null,
    setWorkShopState: (val) => set({workShopState: val})
}));