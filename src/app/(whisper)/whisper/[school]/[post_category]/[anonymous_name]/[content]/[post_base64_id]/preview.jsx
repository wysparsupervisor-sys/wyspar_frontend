"use client";
import { Base62ToUUID } from "@/app/lib/utils/base-converter";
import Request from "@/app/lib/utils/request";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Comments from "./local_comps/comment";
import StarsBackground2 from "@/app/components/animated_backgrounds/stars2";
import { RefreshCcw } from "lucide-react";
import Button from "@/app/components/buttons";
import Link from "next/link";
import ExpiryWarning from "@/app/components/micellanious/expired-warning";

export default function Preview(){
    const params = useParams();
    const { post_base64_id } = params;
    const post_id = Base62ToUUID(post_base64_id);
    const [post_info, setPostInfo] = useState(null);
    const [failed, setFailed] = useState(false);
    const [notExists, setNotExists] = useState(false);
    const [hasExpired, setHasExpired] = useState(false);

    const GetWhisper =  async ()  => {
        setFailed(false); setHasExpired(false);
        const res = await Request(`/app/post/whisper/get?post_id=${post_id}`, "GET");
        if (res.cause && res.cause === "nosub") return setHasExpired(true);
        if(!res.ok){
            setFailed(true);
        } else if (!res.body.length) {
            setNotExists(true);
        } else if (res.body.length) {
            setPostInfo(res.body[0]);
        };
    };

    useEffect(() => {
        GetWhisper();
    }, []);

    return (
        <div className="flex h-[100dvh] max-h-[100dvh] flex-col ites-center justify-center">
            {post_info ? <Comments info={post_info}/>:<StarsBackground2/>}
            <div className="h-full flex flex-col items-center justify-center gap-3">
                {failed && <>
                    Whisper didn't load..
                    <RefreshCcw onClick={GetWhisper} size={40}/>
                </>}
                {notExists && <>Whisper not available</>}
                {(notExists || failed) && <Link className="w-3xs" href="/explore"><Button>Go to feed</Button></Link>}
                {hasExpired && <ExpiryWarning/>}
            </div>
        </div>
    );
};