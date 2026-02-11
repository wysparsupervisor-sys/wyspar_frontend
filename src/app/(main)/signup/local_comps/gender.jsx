import { produce } from "immer";
import { User, UserRound } from "lucide-react";



export default function Gender({context}) {
    const { formInfo, setFormInfo } = context;

    const updateGender = (e) => {
        setFormInfo(current => produce(current, draft => { draft.gender = e.target.value }));
    };

    return (
        <>
            <p className="text-sm text-gray-400 mb-2" style={{lineHeight: "1.3"}}>Select your Gender</p>
            <div className="flex flex-col gap-2 w-full pl-3 pr-3">
                <div className="flex flex-row items-center justify-between">
                    <p className="flex flex-row items-center text-lg"><User strokeWidth={1.6} size={40} color="green"/> Male</p>
                    <input onChange={updateGender} defaultChecked={formInfo.gender==0} name="gender" value={0} type="radio" className="accent-[greenyellow]" style={{transform: "scale(1.5)"}}/>
                </div>
                <div className="flex flex-row items-center justify-between">
                    <p className="flex flex-row items-center text-lg"><UserRound strokeWidth={1.6} size={40} color="orangered"/> Female</p>
                    <input onChange={updateGender} defaultChecked={formInfo.gender==1} name="gender" value={1} type="radio" className="accent-[greenyellow]" style={{transform: "scale(1.5)"}}/>
                </div>
            </div>
        </>
    );
};