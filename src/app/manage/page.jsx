"use client";
import Subscription from "./local_comps/subscription";
import LogOut from "./local_comps/logout";
import DeleteAccount from "./local_comps/delete";

export default function Manage(){
    return (
        <div>
            <div className="h-[55px]"></div>
            <div className="flex flex-col gap-3 p-2">
                <Subscription/>
                <LogOut/>
                <DeleteAccount/>
            </div>
            <div className="h-100"></div>
        </div>
    )
}