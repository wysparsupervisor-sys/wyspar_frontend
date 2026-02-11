"use client";
import Request from "@/app/lib/utils/request";


const interactionQueue = new Map();
let started = false;

async function flush(){
    if(interactionQueue.size === 0) return;

    const payload = Array.from(interactionQueue.values()).slice(0, 40);
    interactionQueue.clear();

    const res = await Request("/app/user/me/interaction", "POST", { interactions: payload });
    
    //if it fails then add them back to queue if it succeeds  then hurray and do nothing
    if(!res.ok) payload.forEach(item => {
        const key = `${item.post_id}${item.interaction_type}`;
        interactionQueue.set(key, item);
    })
};


function start(){
    if(started) return;
    if (typeof window !== 'undefined'){
        started = true;
    } else {
        return;
    };

    setInterval(flush, 60 * 1000);

    //flush batch when user exits tab or minimizes browser and stuff like
    document.addEventListener("visibilitychange", () => {
        if(document.visibilityState == "hidden") {
            flush();
        };
    });

    //flush batch when user refreshes page or anything
    window.addEventListener("beforeunload", flush())
};


start();


export function updateInteraction(postID, interaction_type, value){
    const key = postID + interaction_type;

    //delete key if exists in map and value is false (user undid an interaction. Else if it's false but doesn't exist in map then user is just undoing an interaction sometime  ago so go ahead and add to map to undo it in server
    if(interactionQueue.has(key) && value === 0) return interactionQueue.delete(key);

    //else continue with request
    interactionQueue.set(key, {
        post_id: postID,
        interaction_type: interaction_type,
        value: value,
    });
};