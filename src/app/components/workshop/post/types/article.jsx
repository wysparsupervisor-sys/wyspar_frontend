import { produce } from "immer";
import { usePostContext } from "../context";
import { X } from "lucide-react";
import Image from "next/image";

export default function ArticlePost(){
    const { data, setData } = usePostContext();

    const handleChange = (e) => {
        setData(current => produce(current, draft => { draft.form.text = e.target.value }))
    };

    const RemoveImage = (index=0) => {
        setData(current => produce(current, draft=> { draft.form.images.splice(index, index + 1) }));
        setData(current => produce(current, draft=> { draft.temp.images_object_url.splice(index, index + 1) }))
    };

    return (
        <>
            <div className="p-3">
                <textarea defaultValue={data.form.text} maxLength={1000} placeholder="What's your take on campus today?" onChange={handleChange} className="text-lg text-gray-300 w-full outline-none" onInput={
                    (e) => {
                        const el = e.target;
                        el.style.height = "auto";
                        const newHeight = el.scrollHeight;
                        el.style.height = `${newHeight}px`;
                    }
                }></textarea>
            </div>
            {data.temp.images_object_url[0] && <div className="p-3">
                <p className="relative w-full border-2 rounded-4xl overflow-hidden">
                    <X className="absolute right-5 top-5" size={30} onClick={() => RemoveImage()} style={{filter: "drop-shadow(0 0 2px black)"}}/>
                    <Image alt="image you wanna post" src={data.temp.images_object_url[0]} width={900} height={900} className="w-full"/>
                </p>
            </div>}
        </>
    );
};