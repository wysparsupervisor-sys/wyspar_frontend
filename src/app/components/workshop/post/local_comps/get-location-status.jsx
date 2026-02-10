"use client";
import Request from "@/app/lib/utils/request";
import { produce } from "immer";


export default async function GetLocationStatus(setGeoRes, setData) {
    if(!("geolocation" in navigator)) setGeoRes("unreliable");
    
    navigator.geolocation.getCurrentPosition(
        async (p) => {
            const latitude = p.coords.latitude;
            const longitude = p.coords.longitude;
            const accuracy = p.coords.accuracy;
            const school = "futo";

            alert(`${latitude + " " + longitude + " " + accuracy}`);
            const res = await Request(`/app/user/me/get?payload=location-status&school=${school}&lat=${latitude}&long=${longitude}&accuracy=${accuracy}`, "GET");
            setGeoRes(res.location_status);
            alert(res.location_status)
            setData(current => produce(current, draft => { draft.form.coords = {
                    lat: latitude,
                    long: longitude,
                    accuracy: accuracy,
                    school: school,
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
};