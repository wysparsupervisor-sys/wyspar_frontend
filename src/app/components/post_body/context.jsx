import { createContext, useContext } from "react";


export const PostViewContext = createContext(null);
export const usePostViewContext = () => useContext(PostViewContext);