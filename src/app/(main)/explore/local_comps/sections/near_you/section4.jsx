import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";


export default function Section4(){
    const [coords, setCooords] = useState({});

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (p) => {
                const latitude = p.coords.latitude;
                const longitude = p.coords.longitude;
                const accuracy = p.coords.accuracy;

                const res = await Request(`/app/user/me/get?payload=location-status&lat=${latitude}&long=${longitude}&accuracy=${accuracy}`, "GET");
                setGeoRes(res.location_status);
                setData(current => produce(current, draft => { draft.form.coords = {
                        lat: latitude,
                        long: longitude,
                        accuracy: accuracy,
                    };
                }));
            },
            (err) => {
                if(err.code === err.PERMISSION_DENIED){
                    alert("You didn't allow us know your campus status in order to label your whisper as on-campus, near-campus, or off-campus. Edit your browser settings if you wish for us to do so.");
                    return setGeoRes("no permission");
                };
                setGeoRes("unreliable");
            },
            {
                enableHighAccuracy: true,
                timeout: 1000 * 30,
                maximumAge: 0,
            }
        );
    }, []);

    return (
        <div className="h-full relative">
            {false && <span className="ml-3 p-1 pl-3 pr-3 rounded-full border-2 border-gray-800 text-gray-200">Posts made near <b><i>futo ict</i></b></span>}
            <div className="h-[70%] w-full flex flex-col items-center justify-center gap-5 opacity-70">
                <MapPin size={150} strokeWidth={1.2} color="red"/>
                <PulseLoader color="white" size={30}/>
                <span className="text-xl">Syncing environment</span>
            </div>
        </div>
    );
};