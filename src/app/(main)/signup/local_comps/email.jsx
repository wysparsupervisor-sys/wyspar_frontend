import { produce } from "immer";
import { Mail, Mailbox } from "lucide-react";
import { z } from "zod";
import Request from "@/app/lib/utils/request";
import { useState } from "react";
import { ClipLoader } from "react-spinners";
import { SaveToSessionStorage } from "@/app/lib/utils/session-storage";


export default function Email({context}){
    const { setFormInfo, formInfo, setCurrentSection } = context;
    const [response, setResponse] = useState();
    const [loading, setLoading] = useState(false);

    const sendPersonalData = async () => {
        //if currently in email section (currentSection=4) and user clicks next then send first batch of data to server
        //valiadte anonymous name
        if(formInfo.school.length !== 1) return setResponse("You didn't tell us your school");
        if(formInfo.anonymous_name.trim().length < 3) return setResponse("Anonymous name can't be below 3 characters");
        if(!formInfo.gender) return setResponse("You forgot to say your gender");
        if(!z.string().email().safeParse(formInfo.email).success) return setResponse("Enter a valid email address");

        //send request here
        setLoading(true);
        const res = await Request("/auth/signup?payload=personal-data", "POST", formInfo);
        setResponse(res.msg); setLoading(false);
        if(res.ok) {
            return setCurrentSection(prev => {
            SaveToSessionStorage("signup-state", prev + 1, 1000 * 60 * 10) 
            return (prev+1)})
        }
    };

    return (
        <>
            <Mail color="orange" size={50}/>
            {response ? <p className="text-sm text-[orangered]" style={{lineHeight: "1.3"}}>{response}</p> : <p className="text-sm text-gray-400" style={{lineHeight: "1.3"}}>Enter your email address.<b className="text-white">You can't move to previous steps after this.</b></p>}
            <div className="w-full bg-[rgb(30,30,30)] rounded-sm p-2 flex flex-row items-center">
                <input type="email" onInput={(e) => { e.target.value = e.target.value.replace(/\s/g, '') }} onChange={(e) => setFormInfo(current => produce(current, draft => { draft.email = e.target.value }))} className="outline-none w-full min-w-0" placeholder="Email address"/>
                <Mailbox color="white" strokeWidth="1.6" size={30}/>
            </div>
            <div className="bg-[#5a0019ff] w-full p-2 flex flex-col items-center rounded-sm">
                {loading ? <ClipLoader color="white" size={24}/>:<button className="w-full h-full" onClick={sendPersonalData}>Next</button>}
            </div>
         </>
    );
};