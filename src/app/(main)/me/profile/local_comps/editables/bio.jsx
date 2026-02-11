import Button from "@/app/components/buttons";
import { DynamicTextArea } from "@/app/components/inputs/dynamic-textarea";
import { useRef, useState } from "react";
import Request from "@/app/lib/utils/request";
import { useUserStore } from "../stores/user";
import { produce } from "immer";


export default function BioEdit(){
    const setProfile =  useUserStore((state) => state.setProfile);
    const profile = useUserStore((state) => state.profile);
    const descriptionRef = useRef();
    const [description,  setDescription] = useState(profile.details.description);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState();

    const UpdateDescription = async () => {
        const body = { description: descriptionRef.current.value };

        setLoading(true); setResponse();
        const res = await Request("/app/user/me/edit?payload=description", "POST", body);

        setLoading(false); setResponse(res);
        if(res.ok) setProfile(produce(draft => { draft.profile.details.description = body.description }));
    };

    return (
        <div className="flex gap-5 flex-col items-center w-[90%] min-w-2xs p-5 bg-black rounded-2xl border-1 border-gray-900">
            {response && response.ok ? <span className="text-[greenyellow]">Success</span>:<>
                {response && !response.ok ? <p className="text-[orangered]">{response.msg}</p>:<p className="text-gray-400">Write about yourself with glory!</p>}
                <div className="w-full">
                    <DynamicTextArea maxLength="150" onChange={() => setDescription(descriptionRef.current?.value)} ref={descriptionRef} defaultValue={profile.details.description}></DynamicTextArea>
                </div>
                {((description.trim() !== profile.details.description) && description !== "") && <Button loading={loading} onClick={UpdateDescription}>Update</Button>}
            </>}
        </div>
    );
};