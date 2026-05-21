import { produce } from "immer";
import { Signature } from "lucide-react";


export default function AnonymousName({context}){
    const { formInfo, setFormInfo } = context;

    const updateAnonymousName = (e) => {
        setFormInfo(current => produce(current, draft => { draft.anonymous_name = e.target.value }));
    };
    
    return (
        <div className="w-full flex flex-col items-center gap-3">
            <Signature size={60} color="white"/>
            <div className="w-full">
                <p className="text-sm text-gray-400 mb-2" style={{lineHeight: "1.3"}}>A name for your profile</p>
                <input onInput={(e) => { e.target.value = e.target.value.replace(/\s/g, '') }} pattern="^\S(.*\S)?$" defaultValue={formInfo.anonymous_name} onChange={updateAnonymousName} maxLength={15} className="outline-none w-full min-w-0 w-full bg-[rgb(30,30,30)] rounded p-2" placeholder="name"/>
            </div>
        </div>
    );
};