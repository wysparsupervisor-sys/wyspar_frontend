import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useCampusTodayStore } from "../../../stores/campus-today";

export default function UpdateAlert({updateAlert, setUpdateAlert, containerRef}){
    const [show, setShow] = useState(false);
    const updateDaysBack = useCampusTodayStore((state) => state.updateDaysBack);
    const daysBack = useCampusTodayStore((state) => state.daysBack);

    useEffect(() => {
        if(!updateAlert) return;
        setShow(true);
        setTimeout(() => {setShow(false); setUpdateAlert(null)}, 5000);

    }, [updateAlert]);

    return createPortal(
        <div className="fixed top-0 left-0 h-full w-full z-7 pointer-events-none flex flex-row justify-center">
            <div onClick={() => { containerRef.current?.scrollTo({ top: 0, behavior:"smooth"}); if(daysBack !== 0) updateDaysBack(0) }} className={`absolute bg-blue-900 w-50 text-center flex-grow-0 p-2 rounded-full border-2 transition transition-all duration-700 ease-in-out ${show ? " top-[30%] pointer-events-auto opacity-100":"top-[20%] opacity-0 pointer-events-none"}`}>{updateAlert} new post</div>
        </div>,
        document.body
    );
};