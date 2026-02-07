import Comments from "./local_comps/comment";
import Section1 from "./local_comps/sections/section1";
import Section2 from "./local_comps/sections/section2";
import Section3 from "./local_comps/sections/section3";
import Section4 from "./local_comps/sections/section4";
import { PostViewContext } from "./context";
import React, { useState } from "react";



export default React.memo(function PostBody({info, isUser=false, store}){
    const [postStates, setPostStates] = useState({
        isCommenting: false,
        isUser: isUser,
        Store: store,
    });

    return (
        <PostViewContext.Provider value={{postStates, setPostStates}}>
            <div className="relative flex flex-col gap-2 p-1.5 pt-3 border-t-2 border-gray-900">
                <Section1 info={info} store={store}/>
                <Section2 info={info}/>
                <Section3 info={info}/>
                <Section4 info={info}/> 
            </div>
            {postStates.isCommenting && <Comments info={info}/>}
        </PostViewContext.Provider>
    );
});