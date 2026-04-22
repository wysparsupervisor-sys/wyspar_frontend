"use client";
import StarsBackground2 from "@/app/components/animated_backgrounds/stars2";
import ConnectBody from "@/app/components/connect_body";
import { Base62ToUUID } from "@/app/lib/utils/base-converter";
import Request from "@/app/lib/utils/request";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";

export default function Preview(){
    const [connectInfo, setConnectInfo] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const { details } = params;
    const details_array = decodeURIComponent(details).split("?(!)?");
    const connect_id = Base62ToUUID(details_array[0]);

    useEffect(() => {
        async function GetConnect() {
            setLoading(true);
            const res = await Request("/app/connect/get", "POST", { connect_id });
            if(res.ok) setConnectInfo(res.body);
            if(!res.ok) setError("Might not exist or something went wrong!")
            setLoading(false);
        };

        GetConnect();
    }, []);

    return (
        <html>
            <body>
                <div className="flex flex-col items-center justify-center h-[100dvh]">
                    <div className="absolute top-0 left-0 flex items-center gap-2 p-2 text-lg"><Link href="/explore"><ArrowLeft size={25}/></Link> Connect</div>
                    <StarsBackground2/>
                    {connectInfo && <ConnectBody info={connectInfo}/>}
                    {loading && <SyncLoader color="white"/>}
                    {error && error}
                </div>
            </body>
        </html>
    );
};