import { MoveDown, MoveUp, PenTool } from "lucide-react";
import { useEffect, useRef, useState } from "react";








export function DynamicTextArea({rowLimit=10, enablehashTag, children, maxLength="400", minLength=1, HeaderName="", onChange, ref, className, ...props}){
    const textRef = ref || useRef();
    function Tools() {
        return (
            <div className="text-right w-full bg-[#000020] h-10 p-1.5 pl-5 pr-5 text-gray-300 flex flex-row items-center justify-between rounded-2xl">
                <div>
                    {children}
                </div>
                <span className="flex flex-row items-center gap-4">
                    <span className="text-sm inline-flex items-center">
                        <span className="inline-flex items-center"> <PenTool className={`mr-1 ${textRef.current?.value.trim().length >= minLength ? "text-[limegreen]":"text-[orange]"}`}/> {chars}</span>
                        <span className="inline-flex items-center text-red-600"> <MoveDown size={23} strokeWidth={2.5} className="-mr-1 text-gray-600"/> {minLength}</span>
                        <span className="inline-flex items-center"> <MoveUp strokeWidth={2.5} size={23} className="-mr-1"/> {maxLength}</span>
                    </span>
                </span>
            </div>
        );
    };

    const [chars, setChars] = useState();
    
    const handleChange = (e) => {
        if (e) textRef.current.value = e.target.value;
        setChars(textRef.current?.value.trim().length);

        //if onchange is used where our component is used then run it along
        if (onChange) onChange(e);
    };

    useEffect(() => handleChange(), []);
    return (
        <>
            <div className="w-full">
                <div className="overflow-hidden relative rounded-2xl pt-3 pb-3 border-1 bg-[rgb(15,15,15)] border-[rgb(15,15,15)] mb-2">
                    <textarea placeholder="Write Something" ref={textRef} maxLength={maxLength} onChange={handleChange}  rows={4} className={`w-full pl-3 pr-3 outline-none text-md resize-none bg-[rgb(15,15,15)] text-[rgb(200,200,200)] text-md ${className}`} style={{lineHeight:1.5}} onInput={
                        (e) => {
                            const el = e.target;
                            el.style.height = "auto";
                            const lineHeight = parseInt(window.getComputedStyle(el).lineHeight);
                            const maxHeight = lineHeight * rowLimit;
                            const newHeight = el.scrollHeight;
                            el.style.height = `${Math.min(newHeight, maxHeight)}px`

                        }
                    } {...props}></textarea>
                    <div className="absolute w-full h-12 bottom-0 pointer-events-none" style={{background: "linear-gradient(transparent, black)"}}></div>
                </div>                
                <Tools/>
            </div>
        </>
    );
};