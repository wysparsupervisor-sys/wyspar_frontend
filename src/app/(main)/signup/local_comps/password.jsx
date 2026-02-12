import Request from "@/app/lib/utils/request";
import { Eye, EyeOff, Fingerprint, KeyIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { useRef, useState } from "react";
import { ClipLoader } from "react-spinners";
import { z } from "zod";

export default function Password() {
    const [show, setShow] = useState(false);    
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState();
    const passwordRef = useRef();

    const schema = z.string().min(6, "Password must be at least 6 characters long").refine((value) => /[a-zA-Z]/.test(value) && /\d/.test(value), { message: "Password must be at least a combination of letters & numbers" });
    const SenndPassword = async () => { 
        const password = passwordRef.current?.value;
        const validationResult = schema.safeParse(password);
        if (!validationResult.success) return setResponse(validationResult.error.issues[0].message);

        setLoading(true);
        const res = await Request("/auth/signup?payload=password", "POST", { password: password }); setLoading(false);
        if (!res.ok) return setResponse(res.msg);
        redirect("/explore");
    };

    return (
        <>
            <Fingerprint color="greenyellow" size={50}/>
            {response ? <p className="text-sm text-[orangered]" style={{lineHeight: "1.3"}}>{response}</p> : <p className="text-sm text-gray-400" style={{lineHeight: "1.3"}}>Password must be at least a combination of letters and numbers.</p>}
            <div className="w-full bg-[rgb(30,30,30)] rounded-sm p-2 flex flex-row items-center">
                <input ref={passwordRef} className="outline-none w-full min-w-0" placeholder="Password" type={show ? "text":"password"}/>
                { show ? <Eye color="white" strokeWidth="1.6" size={30} onClick={() => setShow(false)}/>:<EyeOff color="white" strokeWidth="1.6" size={30} onClick={() => setShow(true)}/> }
            </div>
            <div className="bg-[#5a0019ff] w-full p-2 flex flex-col items-center rounded-sm">
                {loading ? <ClipLoader color="white" size={24}/>:<button className="w-full h-full" onClick={SenndPassword}>Next</button>}
            </div>
        </>
    );
};