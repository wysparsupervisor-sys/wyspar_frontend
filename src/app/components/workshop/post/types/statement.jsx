import { useEffect, useState } from "react";
import { usePostContext } from "../context";
import { produce } from "immer";
import { POST_STYLES } from "@/app/lib/data/post-styles";

export default function StatementPost(){
    const { data, setData } = usePostContext();

    const styles = POST_STYLES;

    //default be selected randomly
    const [selectedStyle, setSelectedStyle] = useState(styles[Math.round(Math.random() * (styles.length - 1))]);

    const ClickStyle = (val) => {
        setSelectedStyle(val);
        setData(current => produce(current, draft => { draft.form.style = val }));
    };

    //set the default style to data  on first mount
    useEffect(() => { ClickStyle(selectedStyle) }, [])

    return (
        <>
            <div className="absolute flex flex-row gap-2 overflow-x-scroll h-[18%] w-full p-2">
                {styles.map((val,  i) => (
                    <div key={i} onClick={() => ClickStyle(val)} className={`${val} ${val == selectedStyle && "border-2"} h-full rounded-xl text-xs flex flex-row items-center justify-center`} style={{aspectRatio:"1/1"}}>Hello</div>
                ))}
            </div>
            <div className="h-full flex flex-col justify-center">
                <div className={`outline-none ${selectedStyle} flex flex-col justify-center items-center text-center p-3 ${data.form.text.length < 90 ? "text-2xl":"text-lg"}`} style={{aspectRatio: "4/3"}}>
                    <textarea maxLength={180} className="text-center w-full outline-none" onInput={
                        (e) => {
                            const el = e.target;
                            el.style.height = "auto";
                            const newHeight = el.scrollHeight;
                            el.style.height = newHeight + "px"

                        }
                    } onChange={(e) => setData(current => produce(current, draft => { draft.form.text = e.target.value }))}></textarea>
                </div>
            </div>
        </>
    );
};