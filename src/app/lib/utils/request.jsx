"use client";
import { BACKEND_URL } from "../../../../domain";


//fetch function
const Request = async (endpoint, method, body) => {
    try {
        const result = await fetch(`${BACKEND_URL}${endpoint}`, {
            method: method,
            credentials: "include",
            headers:{
                "Content-Type": "application/json",
            },
            ...(body && {
                body: JSON.stringify(body)
            }),
        });

        //incase of token issues redirect to login
        if(result.status === 401) {
            window.location.href = "/login";
        };
        
        const data = await result.json();
        return data;
    } catch (err) {
        return { ok: false, msg: "Network issues or something else" };
    };
};


export default Request;