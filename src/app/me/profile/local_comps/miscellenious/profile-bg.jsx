import { PROFILE_BACKGROUND_ANIMATIONS } from "@/app/lib/data/profile-bg-animations";
import { GetFromLocalStorage, SaveToLocalStorage } from "@/app/lib/utils/local-storage";
import Request from "@/app/lib/utils/request";
import { AnimatedBackground } from "animated-backgrounds";
import { useEffect, useState } from "react";

export default function ProfileBackground(){
    const [playingAnimation, setPlayingAnimation] = useState();
    const animations = PROFILE_BACKGROUND_ANIMATIONS;

    useEffect(() =>  {
        const generateRandomCover = async () => {
            const key = "profile-bg";

            //first check if user  has been assigned an animated bg today
            const bg = GetFromLocalStorage(key);
            if(bg) return setPlayingAnimation(bg);

            //if none procceed to asign a new one 
            const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
            SaveToLocalStorage(key, randomAnimation, 1000 * 60 * 60 * 24);
            setPlayingAnimation(randomAnimation);

            //save to server so other users viewing his/her profile sees their current animation
            await Request("/app/user/me/edit?payload=profile-bg", "POST", {bg: randomAnimation});
        };
        generateRandomCover();
    }, []);

    return <>
        {playingAnimation && <AnimatedBackground fps={20} adaptivePerformance={true} enablePerformanceMonitoring={true} style={{height: "", position:"absolute", top: 0, left: 0, zIndex:0}} animationName={playingAnimation} interactivity={true}/>}
    </>
};