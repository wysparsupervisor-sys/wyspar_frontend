"use client";
import Request from "@/app/lib/utils/request";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useViewerStore } from "./local_comps/stores/viewer";
import StarsBackground from "@/app/components/animated_backgrounds/stars";
import Section1 from "./local_comps/sections/section1";
import Section2 from "./local_comps/sections/section2";
import Section3 from "./local_comps/sections/section3";
import Section4 from "./local_comps/sections/section4";
import Button from "@/app/components/buttons";
import Link from "next/link";
import { RefreshCcw } from "lucide-react";
import ExpiryWarning from "@/app/components/micellanious/expired-warning";


export default function ProfileVisitor(){
    const params = useParams();
    const router = useRouter();
    const { anonymous_name } = params;
    const profile =  useViewerStore((state) => state.profile);
    const setProfile =  useViewerStore((state) => state.setProfile);
    const [hasExpired, setHasExpired] = useState(false);
    const [exists, setExists] = useState();
    const [retry, setRetry] = useState();

    const GetProfileData = async () => {
        setHasExpired(false);
        setRetry(null);
        //fetch data from server if not cached
        const data = await Request(`/app/user/viewer/${anonymous_name}/get?action=profile-data`, "GET");
        if(data.cause && data.cause === "nosub") return setHasExpired(true);
        if(!data.ok) return setRetry(true);
        if (!data.exists) return setExists(false);
        if(data.body.isMe) return router.push("/me/profile");
        if(data.body) setProfile(() => ({ profile: data.body }));
    };

    useEffect(() => {
        GetProfileData();
    }, []);


    return( 
        <>
            {profile ? <div className="h-full relative">
                <Section4 anonymous_name={anonymous_name}/>
            </div>:<StarsBackground/>}
            <div className="flex flex-col items-center justify-center gap-3 h-full">
                {exists === false && <><p>User doesn't exist</p>
                <Link href="/me/profile" className="w-40"><Button>My Profile</Button></Link></>}
                {retry === true && <>
                    <p>Something went wrong. Refresh!</p>
                    <RefreshCcw size={50} onClick={GetProfileData}/>
                </>}
                {hasExpired && <ExpiryWarning/>}
            </div>
        </>
    );
};