import { AnimatedBackground } from "animated-backgrounds";
import { useEffect, useState } from "react";
import { useViewerStore } from "../stores/viewer";

export default function ProfileBackground(){
    const [playingAnimation, setPlayingAnimation] = useState();
    const profile = useViewerStore((state) => state.profile);

    useEffect(() =>  {
        setPlayingAnimation(profile.details.profile_background);
    }, []);

    return <>
        {playingAnimation && <AnimatedBackground fps={20} adaptivePerformance={true} enablePerformanceMonitoring={true}  style={{height: "", position:"absolute", top: 0, left: 0, zIndex:0}} animationName={playingAnimation} interactivity={true}/>}
    </>
};