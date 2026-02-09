import { useEffect, useState } from "react";

export default function First({play, state}){
    const { current, setCurrent } = state;
    const [isHidden, setIsHidden] = useState(current !== 2);

    useEffect(() => {
        setIsHidden(current !== 2);
    }, [current]);
    return (
        <div className={`z-2 top-0 left-0 fixed w-full h-full flex flex-col gap-3 pl-5 justify-center transition-all ${isHidden ? "opacity-0 pointer-events-none":"opacity-100"}`} style={{transitionDuration: "4s"}}>
            <h1 className="text-2xl">Welcome To Wyspar!</h1>
            <div className="bg-[rgb(10,10,10)] rounded-md max-w-70 text-sm p-3 border-l-3 border-red-600" style={{boxShadow: "inset 10px 10px 20px black"}}>
                A platform created for you! To give you a free voice, but with a little spice of something nice! Anonymicity!
            </div>
        </div>
    );
}