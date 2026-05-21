import DropDownSmall from "@/app/components/inputs/dropdown/small";
import { ArrowLeft, MapPin, RefreshCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePostContext } from "../context";
import { produce } from "immer";
import GetLocationStatus from "../local_comps/get-location-status";
import { ClipLoader } from "react-spinners";


export default function PostHeader({setAction}){
    const { data, setData } = usePostContext();
    const [geoRes, setGeoRes] = useState(null);

    function GetLocationData(){ 
        setGeoRes(null);
        //delete previous geodata
        setData(current => produce(current, draft => { draft.form.coords = null}));
        GetLocationStatus(setGeoRes, setData);
    };
    useEffect(() => {
        setData(current => produce(current, draft => { draft.temp.location_status = geoRes}));
    }, [geoRes]);
    useEffect(() => {
        GetLocationData();
    }, []);

    return(
        <div className="flex flex-row items-center z-1 gap-1 h-13 p-2 text-sm">
            <ArrowLeft onClick={() => setAction("select")} className="flex-shrink-0" size={30} strokeWidth={1.6}/>
            <div className="flex flex-shrink-0 flex-row items-center gap-1">
                <MapPin color="orangered"/>
                <p className={`bg-black flex flex-row items-center gap-2 p-1 border-2 ${geoRes === "on-campus" && "border-[greenyellow]"} ${geoRes === "near-campus" && "border-[orangered]"} ${geoRes === "off-campus" && "border-[red]"} ${((geoRes === "unreliable") || (geoRes === "no permission") || !geoRes) && "border-gray-500"} rounded-full pl-3 pr-3`}>{geoRes ? <>{((geoRes == "unreliable") || (geoRes == "no permission")) ? <><RefreshCcw onClick={GetLocationData} color="white" size={15}/>{geoRes}</>:geoRes}</>:<><ClipLoader color="white" size={15}/>loading...</>}</p>
            </div>
        </div>
    );
};