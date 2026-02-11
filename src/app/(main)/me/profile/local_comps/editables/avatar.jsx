import Button from "@/app/components/buttons";
import ChooseAvatar from "@/app/components/avatar/choose";
import { useState } from "react";
import Request from "@/app/lib/utils/request";
import { useUserStore } from "../stores/user";
import { produce } from "immer";

export default function AvatarEdit(){
    const setProfile =  useUserStore((state) => state.setProfile);
    const [newAvatar, setNewAvatar] = useState();
    const [response, setResponse] = useState();
    const [loading, setLoading] = useState(false);

    const UpdateAvatar = async () => {
        setLoading(true); setResponse("");
        const res = await Request("/app/user/me/edit?payload=avatar", "POST", newAvatar);

        setResponse(res); setLoading(false);
        if(res.ok) setProfile(produce(draft => { draft.profile.details.avatar = newAvatar }));
    };

    return (
        <div className="flex gap-5 flex-col items-center w-[80%] min-w-2xs p-5 bg-black rounded-2xl border-1 border-gray-900">
            {response && response.ok ? <p className="text-[greenyellow]">Success</p> : <>
                {response && !response.ok ? <p className="text-[orangered]">{response.msg}</p>:<p className="text-gray-400">Select your new avatar!</p>}
                <ChooseAvatar setAvatar={setNewAvatar} preventChange={loading}/>
                <Button loading={loading} onClick={UpdateAvatar}>Update</Button>
            </>}
        </div>
    );
};