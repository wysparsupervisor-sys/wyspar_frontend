import { Activity, ImagePlus, PenBox, Type } from "lucide-react";
import { usePostContext } from "../context";
import { produce } from "immer";
import { useRef } from "react";
import imageCompression from "browser-image-compression";


export default function PostFooter({resetFunc}){
    const { data, setData } = usePostContext();
    const { type } = data.form;
    const imageRef = useRef();

    const setType = (typeName) => {
        //if clicking the already displayed type then do nothing
        if (typeName === data.form.type) return;

        //if changing type reset useState
        resetFunc();
        setData(current => produce(current, draft => { draft.form.type = typeName }))
    };

    const AddImage = async (e) => {
        const options = {
            maxSizeMB: 0.2, //max 200kb
            maxWidthOrHeight: 720,
            useWebWorker: true,
            fileType: "image/webp",
        };

        const file = e.target.files[0];
        const compressedFile = await imageCompression(file, options);
        setData(current => produce(current, draft => { draft.form.images.push(compressedFile)}));
        setData(current => produce(current, draft => { draft.temp.images_object_url.push(URL.createObjectURL(compressedFile))}));
    };

    
    return (
        <div className="flex flex-row justify-between items-center bg-black p-1 pl-3 pr-3 border-t border-gray-900 h-13">
            <div className="flex flex-row gap-2 items-center">
                {type === "article" && <>
                    {!data.form.images[0] && <ImagePlus size={30} onClick={() => imageRef.current.click()}/>}
                    <input ref={imageRef} type="file" accept="image/*" hidden onChange={AddImage}/>
                </>}
                <PenBox className={`${type=="article" && "bg-white text-black rounded-sm"}`} onClick={() => setType("article")} size={30}/>
                <Type className={`${type=="statement" && "bg-white text-black rounded-sm"}`} onClick={() => setType("statement")} size={30}/>
            </div>
            <div className="flex flex-row gap-2 items-center">
                <Activity/>{type === "article" && `${1000 - Number(data.form.text.length)}`}{data.form.text && type === "statement" && `${180 - Number(data.form.text.length)}`}
            </div>
        </div>
    );
};