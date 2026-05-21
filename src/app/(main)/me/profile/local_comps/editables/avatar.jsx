import { useRef, useState } from "react";
import Request from "@/app/lib/utils/request";
import { useUserStore } from "../stores/user";
import { produce } from "immer";
import { Upload } from "lucide-react";
import Image from "next/image";
import cropImageByRatio from "@/app/lib/utils/crop-image";
import imageCompression from "browser-image-compression";
import { ClipLoader } from "react-spinners";
import { SaveToLocalStorage } from "@/app/lib/utils/local-storage";


export default function AvatarEdit(){
    const setProfile =  useUserStore((state) => state.setProfile);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [file240, setFile240] = useState(null);
    const [file50, setFile50] = useState(null);
    const [response, setResponse] = useState();
    const [loading, setLoading] = useState(false);

    const inputRef = useRef(null);

    const handleImageChnge = async (e) => {
        const options_240px = {
            maxSizeMB: 0.2, //max 200kb
            maxWidthOrHeight: 240,
            useWebWorker: true,
            fileType: "image/webp",
        };

        const options_50px = {
            maxSizeMB: 0.2, //max 200kb
            maxWidthOrHeight: 50,
            useWebWorker: true,
            fileType: "image/webp",
        };

        const raw_file = e.target.files[0];
        const cropped_file = await cropImageByRatio(1,1, raw_file);

        const output_file_240px = await imageCompression(cropped_file, options_240px);
        const output_file_50px = await imageCompression(cropped_file, options_50px);

        setFile240(output_file_240px);
        setFile50(output_file_50px);

        if(cropped_file){
            const url = URL.createObjectURL(output_file_240px);
            setPreviewUrl(url);
        };
    };


    const UploadImage = async () => {
        setLoading(true);
        const res_url = await Request(`/app/user/me/edit?payload=avatar&action=get-presigned-url`, "POST");
        if(!res_url.ok) { setResponse({ok:false, msg:"Something went wrong"}); return setLoading(false); };

        try {
            const slot240 = res_url.slots.find((s) => s.size === "240px");
            const slot50 = res_url.slots.find((s) => s.size === "50px");

            await Promise.all([
                fetch(slot240.url, {
                    method: "PUT",
                    body: file240,
                    headers: { 'Content-Type': "image/webp" },
                }),
                fetch(slot50.url, {
                    method: "PUT",
                    body: file50,
                    headers: { 'Content-Type': "image/webp" },
                }),
            ]);

            const res_upload = await Request(`/app/user/me/edit?payload=avatar&action=upload`, "POST");
            if(!res_upload.ok) throw new Error('Something went wrong');
            setResponse({ok:true, msg:"success"});
            SaveToLocalStorage("cache_query_hack", Math.random().toString(36).substring(2, 7), 1000 * 60 * 60 * 24 * 365);

            //forces it to cause a useEffect
            setProfile(produce(draft => { draft.profile.details.profile_photo ="" }));
            setProfile(produce(draft => { draft.profile.details.profile_photo = res_upload.prefix }));
        } catch (err) {
            setResponse({ok:false, msg:"Something went wrong"});
        } finally{
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-5 flex-col items-center w-[80%] min-w-2xs p-5 bg-black rounded-2xl border-1 border-gray-900">
            {response && response.ok ? <p className="text-[greenyellow]">Success</p> : <>
                {response && !response.ok ? <p className="text-[orangered]">{response.msg}</p>:<p className="text-gray-400">Add a new picture</p>}
                <div>
                    {previewUrl && <Image src={previewUrl} alt="new profile photo" height={60} width={60} className="rounded-full w-30 h-30"/>}
                </div>
                {!loading && <button onClick={() => inputRef.current.click()} className="flex items-center gap-2 border-2 pl-15 pr-15 p-1 rounded">Select <Upload size={20}/></button>}
                <input ref={inputRef} type="file" onChange={handleImageChnge} accept="image/*" style={{display:"none"}}/>
                {previewUrl && <button className="pl-18 pr-18 p-1 rounded bg-[#5a0019ff] flex items-center justify-center" onClick={UploadImage}>{loading ? <ClipLoader color="white" size={20}/>:"Update"}</button>}
            </>}
        </div>
    );
};