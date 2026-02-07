"use client";
import { ChevronDown, ChevronUp, Diamond } from "lucide-react";
import { useState } from "react";


export default function DropDownSmall({title, options, selected, setSelected, maxsize, icons}){

    //display option when select icon is clicked and do the opposite when clicked again
    const [show, setShow] = useState(false);
    const toggleElement = () => {
        setShow(prev => !prev);
    };

    //when clicked add a new option to selected list
    const addOption = (optionVal) => {
        setSelected(optionVal);
    };


    return(
        <div className="relative w-full flex-grow-1">
            <div className="flex flex-row items-center bg-black border-2 border-gray-500 p-0.5 pl-2 pr-2 rounded-2xl" >
                <span onClick={toggleElement}>{show ? (<ChevronUp strokeWidth={1.5}/>):(<ChevronDown strokeWidth={1.5}/>)}</span>
                <span>{selected ? selected: title}</span>
            </div>

            <div className="absolute w-full">
                {
                    show && <div className="bg-[rgb(15,15,15)] overflow-hidden flex flex-col gap-1 rounded-md mt-1">
                    {options.map((option, index) => {
                        const Icon = icons && icons[option] ? icons[option].icon : Diamond;
                        return (<div onClick={() => addOption(option)} key={index} className={`flex flex-row items-center ${selected === option && "bg-[rgb(30,30,30)]"} gap-2 p-1`}>
                            <Icon size={20} color="white"/><span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                        </div>
                    )})}
                    </div>
                }
            </div>
        </div>
    )
};