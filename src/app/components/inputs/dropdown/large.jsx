"use client";
import { ChevronDown, ChevronUp, Gem, PlusCircle, X } from "lucide-react";
import { useState } from "react";


export default function DropDown({title, options, selected, setSelected, maxsize}){

    //display option when select icon is clicked and do the opposite when clicked again
    const [show, setShow] = useState(false);
    const toggleElement = () => {
        setShow(prev => !prev);
    };

    //when clicked add a new option to selected list
    const addOption = (optionVal) => {
        const optionObject = options.find(obj => obj.value === optionVal);
        if(optionObject && !selected.some(obj => obj.value === optionObject.value) && !selected.some(obj => obj.value === optionObject.title) && (selected.length < maxsize)){
            setSelected(prev => [...prev, optionObject]);
        };
    };
    const removeOption = (optionVal) => {
        setSelected(prev => prev.filter(obj => obj.value !== optionVal));
    };


    return(
        <div>

            <div className="flex flex-wrap gap-1 mb-1">
                {selected.map((option, index) => (
                    <div key={index} className="flex flex-row items-center gap-1 text-sm p-1.5 border border-gray-800 bg-black rounded-xl">
                        <span>{option.title}</span>
                        <X onClick={() => {removeOption(option.value)}} size={20}/>
                    </div>
                ))}
            </div>

            <div className="flex flex-row justify-between items-center bg-[#000090] border-1 p-2 rounded-md" >
                <div className="flex flex-row gap-2 items-center">
                    <Gem strokeWidth={1.5}/>
                    <span>{title}</span>
                </div>
                <div className="flex flex-row items-center gap-1">
                    <span>Select</span>
                    <span  onClick={toggleElement}>{show ? (<ChevronUp strokeWidth={1.5}/>):(<ChevronDown strokeWidth={1.5}/>)}</span>
                </div>
            </div>

            {
                show && <div className="bg-white rounded-md mt-1">
                {options.map((option, index) => (
                    <div key={index} className={`flex flex-row justify-between p-2 ${index !== 0 ? 'border-t-1':''} border-red-500`}>
                        <span className="text-[#000010]">{option.title}</span>
                        <PlusCircle color="#000090" onClick={() => {addOption(option.value)}}/>
                    </div>
                ))}
                </div>
            }
        </div>
    )
};