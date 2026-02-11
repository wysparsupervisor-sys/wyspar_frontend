import DropDown from "@/app/components/inputs/dropdown/large";
import { schools } from "@/app/lib/data/schools";
import { produce } from "immer";
import Image from "next/image";
import { useEffect, useState } from "react";


export default function School({context}){
    const { formInfo, setFormInfo } = context;
    const [selected, setSelected] = useState(formInfo.school);
    
    useEffect(() => {
        setFormInfo(current => produce(current, draft => { draft.school = selected }));
    }, [selected])
    
    return (
        <div className="w-full flex flex-col items-center gap-3">
            <p className="flex flex-row items-center gap-3 text-2xl"><Image alt="logo" src="/logo.png" height={70} width={70}/>Get Started</p>
            <div className="w-full">
                <p className="text-sm text-gray-400 mb-2" style={{lineHeight: "1.3"}}>Which school do you belong to?</p>
                <DropDown maxsize={1} title="Your school" selected={selected} setSelected={setSelected} options={schools}/>
            </div>
        </div>
    );
};