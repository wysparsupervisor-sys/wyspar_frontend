"use client";
import Request from "@/app/lib/utils/request";
import { Calendar1, CheckCircle, RefreshCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ClipLoader, SyncLoader } from "react-spinners";
import Paystack from "@paystack/inline-js";


export default function Subscription(){
    const [loading, setLoading] = useState(false);
    const [vFailed, vSetFailed] = useState(false);
    const [vLoading, vSetLoading] = useState(false);
    const [vMSG, vSetMSG] = useState(null);
    const [expiry, setExpiry] = useState(null);
    const [vSuccess, vSetSuccess] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const [retry, setRetry] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);


    //geet sub data from server
    useEffect(() => {
        async function GetSubData(){
            const res = await Request("/app/user/me/subscription?action=get-data", "POST", {});
            if(res.ok) setExpiry(res.expiry);
            if(res.is_processing) setIsProcessing(true);
        };
        GetSubData();
    }, []);

    
    const startPayment = async () => {
        setLoading(true); setRetry(false); setCancelled(false); vSetSuccess(false); vSetLoading(false); setRetry(false); setVerifying(false);
        const res = await Request("/app/user/me/subscription?action=initialize", "POST", {});
        if(res.ok){
            const paystack = new Paystack();
            setVerifying(true); setLoading(false);
            paystack.newTransaction({
                accessCode: res.access_code,
                onSuccess: () => verifyPayment(res.reference),
                onCancel: () => handleCancel(res.reference),
            });
        } else {
            setRetry(true);
            setLoading(false);
        };
    };

    const verifyPayment = async (ref) => {
        vSetFailed(false); vSetMSG(null); vSetLoading(true); setVerifying(true);
        const res = await Request("/app/user/me/subscription?action=verify", "POST", { reference: ref });
        vSetLoading(false);
        if(!res.ok){
            vSetFailed(true);
            vSetMSG(res.msg);
        } else {
            setIsProcessing(false);
            vSetSuccess(true);
            setExpiry(res.expiry);
            setTimeout(() => {
                setVerifying(false);
            }, [2000]);
        };
    };

    const handleCancel = async (ref) => {
        //still check if user paid cauuse onCanceel csn be canceeelling an alraedy set up request
        vSetLoading(true);
        const res = await Request("/app/user/me/subscription?action=verify", "POST", { reference: ref });
        vSetLoading(false);
        if(!res.ok){
            setCancelled(true);
            setTimeout(() => {
                setCancelled(false);
                setVerifying(false);
            }, [2000]);
        } else {
            vSetSuccess(true);
            setExpiry(res.expiry);
            setTimeout(() => {
                setVerifying(false);
            }, [2000]);
        };
    };

    return (
        <div className="flex flex-col gap-5 border border-gray-900/20 rounded-xl p-3 bg-[#000015]">
            {!verifying && <>
                <span className="text-xl flex flex-row justify-between"><span className="flex flex-row items-center gap-2"><Calendar1/>Subscribe</span> <b className="text-lg">NGN 750</b></span>
                <p className="text-sm p-2 rounded-lg bg-black">Click payment to subscribe to the next 30 days at 750 naira.</p>
                <div className="flex flex-row gap-2">
                    <div className="bg-[rgb(15,15,15)] text-sm p-1 w-full rounded-lg pl-3 border border-gray-900/20"  style={{boxShadow: "inset 10px 10px 30px black"}}>
                        Next Expiry:<br/>
                        <span className="text-gray-300 text-xs">{expiry ? new Intl.DateTimeFormat("en-US", {year: "numeric", month:"short", day:"numeric"}).format(new Date(expiry)):"loading..."}</span>
                    </div>
                    <div onClick={startPayment} className="w-full bg-[#5a0019ff] flex flex-col items-center justify-center rounded-lg">
                        {!retry && <>{loading ? <ClipLoader size={25} color="white"/>:<>{isProcessing ? "Retry":"Payment"}</>}</>}
                        {retry && !loading && <RefreshCcw onClick={startPayment} size={25}/>}
                    </div>
                </div>
                {isProcessing && <div className="text-sm text-gray-200 underline text-center">Went wrong? try checking your email</div>}
            </>}
            {verifying && <div className="h-30 flex flex-col items-center justify-center gap-3">
                {verifying && !vLoading && !vFailed && !vSuccess && !cancelled && <p>Starting transaction...</p>}
                {vLoading && !vFailed && !vSuccess && <>
                    <p>Verifying your payment</p>
                    <SyncLoader color="white"/>
                </>}
                {vFailed && !vSuccess && !vLoading && <>
                    <p>{vMSG}</p>
                    <RefreshCcw onClick={verifyPayment} size={40}/>
                </>}
                {vSuccess && !vLoading && !vFailed && <>
                    <p>You've subscribed successfully!</p>
                    <CheckCircle size={50} color="greenyellow"/>
                </>}
                {cancelled && <>
                    <p>You cancelled payment</p>
                    <X size={50} color="orangered"/>
                </>}
            </div>}
        </div>
    );
};