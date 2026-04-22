import { DynamicTextArea } from "@/app/components/inputs/dynamic-textarea";
import { GetFromLocalStorage, SaveToLocalStorage } from "@/app/lib/utils/local-storage";
import { ChevronDown, ChevronUp, Gem } from "lucide-react";
import { useRef, useState } from "react";

export default function Description(){
    const descriptionRef = useRef();
    const [showDescription, setShowDescription] = useState(!((GetFromLocalStorage("connect-description") || "").length > 0));

    function GetDescription(){
        const cached = GetFromLocalStorage("connect-description");
        if(cached) return cached;

        SaveToLocalStorage("connect-description", "", 1000 * 60 * 60 * 24 * 365 * 100);
        return "";
    };

    async function UpdateDescription(){
        SaveToLocalStorage("connect-description", descriptionRef.current?.value, 1000 * 60 * 60 * 24 * 365 * 100);
    };

    return (
        <div className="mt-2">
            <p className="flex items-center gap-1 text-sm"><Gem size={20}/><span>You see yourself as?</span> {showDescription ? <ChevronUp onClick={() => setShowDescription(!showDescription)} className="ml-2" size={25}/>:<ChevronDown onClick={() => setShowDescription(!showDescription)} className="ml-2" size={25}/>}</p>
            {showDescription && <DynamicTextArea ref={descriptionRef} onChange={UpdateDescription} style={{height:"30px"}} minLength={3} rowLimit={1} maxLength="40" defaultValue={GetDescription()} placeholder="e.g the person everyone needs"/>}
        </div>
    );
};