import { ArrowLeft, Check, Frown, Handshake, InfoIcon, MapPin, RefreshCcw, Send, UserCheck, UserRound, UserRoundCheck, UserRoundSearch, UserSearch, X } from "lucide-react";
import { DynamicTextArea } from "../../inputs/dynamic-textarea";
import { useRef, useState } from "react";
import { z } from "zod";
import { GetFromLocalStorage, SaveToLocalStorage } from "@/app/lib/utils/local-storage";
import { BarLoader, SyncLoader } from "react-spinners";
import ExpiryWarning from "../../micellanious/expired-warning";
import Request from "@/app/lib/utils/request";
import { useUserStore } from "@/app/(main)/me/profile/local_comps/stores/user";
import Description from "./local_comps/description";

const schema = z.object({
    purpose: z.string().trim().min(5, "I'm looking for... must be at least 5 characters"),
    phone: z.string().regex(/^0[0-9]{10}$/, "Whatsapp number is not valid"),
});

export default function IAmLookingForSomeone({setAction}){
    const addNewConnect = useUserStore((state) => state.addNewConnect);
    const setShowing = useUserStore((state) => state.setShowing);
    const [showDisclaimer, setShowDisclaimer] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [postingState, setPostingState] = useState(null);
    const purposeRef = useRef(null);
    const phoneRef = useRef(null);
    const locationRef = useRef(null);
    const extraRef = useRef(null);

    const SendLooking = async () => {
        const purpose = purposeRef.current.innerText;
        const phone = phoneRef.current.value;
        const location = locationRef.current.value || "";
        const extra = extraRef.current.value || "";

        const result = schema.safeParse({purpose, phone});
        if(!result.success) {
            return alert (result.error.issues[0].message);
        };

        if((GetFromLocalStorage("connect-description") || "").length < 3) return alert("See yourself as must be at least 3 characters long")

        //show disclaimer during the first post
        const disclaimer_has_shown_before = GetFromLocalStorage("disclaimer-has-shown");
        if(!disclaimer_has_shown_before) {
            SaveToLocalStorage("disclaimer-has-shown", true, 1000 * 60 * 60 * 24 * 365);
            return setShowDisclaimer(true);
        };

        //save phone and adrees in localstorage everytime
        SaveToLocalStorage("phone-n-address", { phone: phone, address: location || null }, 1000 * 60 * 60 * 24 * 365);
        
        
        //proceed normally if everything went well
        setPostingState("sending");
        const res = await Request("/app/user/me/connect", "POST", { purpose, phone, location, extra, description: GetFromLocalStorage("connect-description")});
        if(res.cause && res.cause === "notsub") return setPostingState("notsub")
        if(res.cause && res.cause === "limit") return setPostingState("limit")
        if(!res.ok) return setPostingState("failed");

        //request went smooth
        addNewConnect([res.returned]);
        setPostingState("success");
        setTimeout(() => {
            setAction(null);
            setShowing("connect");
        }, 2000);
    };

    return (
        <div className="fixed top-0 left-0 h-full max-h-[100dvh] w-full bg-black z-2 overflow-y-scroll">
            <div className="flex flex-row h-13 items-center justify-between pl-3 pr-3">
                <div className="flex items-center gap-2">
                    <ArrowLeft size={25} onClick={() => setAction("select")}/>
                    Connect
                </div>
                <div className="flex items-center gap-2">
                    <InfoIcon onClick={() => setShowInfo(true)}/>
                </div>
            </div>
            <div className="flex flex-col gap-3 p-5 pt-0 m-3 mt-0 mb-0 rounded-4xl border-2 pt-2 pb-6">
                <div className=" flex flex-col items-center gap-2 rounded-3xl mb-3 p-3">
                    <div className="flex p-2 pl-8 pr-8 rounded-4xl flex-row items-center justify-center gap-1 ">
                        <UserSearch size={37}/><Handshake strokeWidth={2.5} size={22}/><UserCheck size={37}/>
                    </div>
                    <div className="rounded-xl w-full text-center p-2">
                        <b className="">I'm looking for someone </b>
                        <span ref={purposeRef} data-placeholder="for what?" suppressContentEditableWarning contentEditable className="outline-none empty:before:content-[attr(data-placeholder)] empty:before:pointer-events-none p-1 empty:before:text-gray-400 cursor-text"
                            onInput={(e) => {
                                if (e.target.innerText.length > 60){
                                    e.target.innerText = e.target.innerText.slice(0,100);
                                };
                            }}
                        ></span>
                    </div>
                </div>
                <div className="mt-[-0.5rem] flex flex-col items-center">
                    <label className="text-sm text-gray-300">Your whatsapp number</label>
                    <div className="flex flex-row h-10 w-[70%] rounded-xl overflow-hidden">
                        <div className="h-10 w-12 flex-shrink-0 bg-green-500 flex flex-row items-center justify-center"><UserRound strokeWidth={2.5}/></div>
                        <input defaultValue={GetFromLocalStorage("phone-n-address")?.phone} ref={phoneRef} type="number" maxLength="11" className="pl-2 outline-none bg-[rgb(15,15,15)] flex-grow-1" placeholder="080xxxxxxxx"/>
                    </div>
                </div>
                <div className="mt-1 flex flex-col items-center">
                    <label className="text-sm text-gray-300">Where do you stay? <b>(optional)</b></label>
                    <div className="flex flex-row h-10 w-[70%] rounded-xl overflow-hidden">
                        <div className="h-10 w-12 flex-shrink-0 bg-[orangered] flex flex-row items-center justify-center"><MapPin strokeWidth={2.5}/></div>
                        <input defaultValue={GetFromLocalStorage("phone-n-address")?.address} ref={locationRef} type="text" maxLength="15" className="pl-2 outline-none bg-[rgb(15,15,15)] w-full" placeholder="Hostel/lodge?"/>
                    </div>
                </div>
                <div className="mt-1">
                    <label className="text-sm text-gray-300">Extra details? <b>(optional)</b></label>
                    <DynamicTextArea style={{height:"30px"}} ref={extraRef} rowLimit={2} maxLength="100"/>
                </div>
                <Description/>
            </div>
            <div className="flex items-center justify-center p-3">
                <div className="flex flex-row items-center bg-blue-900 justify-center rounded-full h-13 w-13">
                    <Send onClick={SendLooking}/>
                </div>
            </div>

            {showDisclaimer && <div className="p-5 bg-black/40 fixed h-full w-full backdrop-blur-sm top-0 left-0 flex items-center justify-center flex-col gap-3">
                <h1 className="text-xl mb-5">Before you post know this!</h1>
                <span>1. Your WhatsApp number is never visible to anyone. Tapping Connect takes them straight to your DM privately.</span>
                <span>2. This post is completely anonymous from your Wyspar profile. No one can tell it's you.</span>
                <span>3. It won't appear on your profile page by an external visitor.</span>
                <span>4. We made things this way so people can't just know the phone number of a person behind a Wyspar account.</span>
                <div className="absolute bottom-4 right-4">
                    <button onClick={() => {setShowDisclaimer(false); SendLooking();}} className="bg-blue-900 pl-5 pr-5 p-1 rounded-full">Continue</button>        
                </div>
            </div>}

            {showInfo && <div className="p-5 bg-black/40 absolute h-full w-full backdrop-blur-sm top-0 left-0 flex items-center justify-center flex-col text-lg text-blue-100">
                <X onClick={() => setShowInfo(false)} className="absolute top-3 left-4" size={30}/>
                Connect is a feature for finding anyone on campus for anything. Looking for a Gym partner? someone to teach you stuff? a specific friend? someone to help you with chores? Anything you can imagine. Immediately after posting we match your post with similar to make connections faster. Then send notifications to users who are likely to be the person you're looking for based on what we know of them. Complete the sentence "I'm looking for someone" and begin connecting with your campus.
            </div>}
            {postingState && <div className="fixed flex flex-col items-center justify-center top-0 left-0 bg-black/90 h-full w-full z-9">
                <div className="flex flex-col gap-4 items-center">
                    {postingState == "sending" && <>
                        <div className="flex flex-row items-center justify-center gap-1">
                            <UserRoundSearch size={50}/><Handshake strokeWidth={2.5} size={30}/><UserRoundCheck size={50}/>
                        </div>
                        <p className="text-lg text-gray-200">Adding your connect...</p>
                        <SyncLoader color="white"/>
                    </>}
                    {postingState == "success" && <>
                        <Check size={80}/>
                        <p className="text-lg text-gray-200">Connect Successful...</p>
                        <BarLoader color="white"/>
                    </>}
                    {postingState == "failed" && <>
                        <X className="absolute top-5 left-5" size={30} onClick={() => setPostingState(null)}/>
                        <RefreshCcw size={60} onClick={SendLooking}/>
                        <p className="text-lg text-center text-gray-200">Something went wrong! <br/> Try again</p>
                    </>}
                    {postingState == "notsub" && <>
                        <X className="absolute top-5 left-5" size={30} onClick={() => setPostingState(null)}/>
                        <ExpiryWarning/> 
                    </>}
                    {postingState == "limit" && <>
                        <X className="absolute top-5 left-5" size={30} onClick={() => setPostingState(null)}/>
                        <Frown size={80} strokeWidth={1}/>
                        <p className="text-lg text-gray-200 text-center">You can't have more than 20 connects at a time. Try deleting some or wait for them to expire.</p>
                    </>}
                </div>
            </div>}
        </div>
    );
};