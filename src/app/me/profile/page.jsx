"use client";
import { useEffect } from "react";
import Section1 from "./local_comps/sections/section1";
import Section2 from "./local_comps/sections/section2";
import Section3 from "./local_comps/sections/section3";
import Request from "@/app/lib/utils/request";
import { GetFromSessionStorage, SaveToSessionStorage } from "@/app/lib/utils/session-storage";
import StarsBackground from "@/app/components/animated_backgrounds/stars";
import Section4 from "./local_comps/sections/section4";
import { useUserStore } from "./local_comps/stores/user";


export default function Profile(){
    const profile =  useUserStore((state) => state.profile);
    const setProfile =  useUserStore((state) => state.setProfile);

    useEffect(() => {
        const GetProfileData = async () => {
            const key = "my-profile-data";

            //check if user profile is already in session storage
            const cached = GetFromSessionStorage(key);
            if(cached) return setProfile(() => ({ profile: cached }));

            //fetch data from server if not cached
            const data = await Request("/app/user/me/get", "GET");
            if(data && data.ok) setProfile(() => ({ profile: data.body }));

            //store fetched data on session storage for 7 minutes
            SaveToSessionStorage(key, data.body, 1000 * 60 * 7);
        };

        GetProfileData();
    }, []);

    //any change in profile (caused by user editing profile) should reflect locally in cache
    useEffect(() => {
        const key = "my-profile-data";
        const cached = JSON.parse(sessionStorage.getItem(key));
        if(!cached) return //if cache has expired then no need
        
        const new_expiry = cached.expiry - Date.now(); 

        SaveToSessionStorage(key, profile, new_expiry);
    }, [profile]);


    return (
        <>
            {profile ? <div className="h-full relative">
                <Section4/>
            </div>:<StarsBackground/>}
        </>
    );
};