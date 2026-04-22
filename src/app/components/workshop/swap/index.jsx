import { ArrowLeft, ArrowLeftRight, Camera, Info, MapPin,  Package, PackageCheck, PackageSearch, ScrollText, UserRound, UserRoundCheck, UserRoundSearch } from "lucide-react";
import LinksBackground2 from "../../animated_backgrounds/links2";

export default function Swap({setAction}){
    return (
        <div className="absolute top-0 left-0 h-full max-h-[100dvh] w-full bg-black z-2">
            <LinksBackground2/>
            <div className="flex flex-row h-13 items-center justify-between pl-3 pr-3">
                <ArrowLeft size={30} onClick={() => setAction("select")}/>
                <b>Swap Stuff</b>
                <Info/>
            </div>
            <div  className="flex flex-col gap-3 p-3 pt-0 m-3 mt-0 mb-0 rounded-2xl border-2 border-gray-900/70 pt-2 pb-4 backdrop-blur-md" style={{boxShadow:"0 0 40px rgba(255, 255, 255, 0.1)"}}>
                <div className="flex flex-col items-center gap-2 rounded-3xl mb-3 p-3">
                    <div className="flex p-2 pl-8 pr-8 rounded-4xl flex-row items-center justify-center gap-1 backdrop-blur-sm bg-black/5" style={{boxShadow:"0 0 20px rgba(157, 255, 0, 0.64)"}}>
                        <PackageSearch size={37}/><ArrowLeftRight strokeWidth={2.5} size={22}/><PackageCheck size={37}/>
                    </div>
                </div>
                <div className="">
                    <label className="text-sm text-gray-300">What are you giving?</label>
                    <div className="w-full flex flex-row backdrop-blur-sm bg-[#000090]/15 border border-gray-900/70 rounded-2xl overflow-hidden">
                        <div className="flex-shrink-0 w-30 flex flex-col items-center justify-center gap-1" style={{aspectRatio: "1/1"}}>
                            <Camera color="white" size={50}/>
                            <span className="text-xs">Add pic of item</span>
                        </div>
                        <div className="flex-grow-1 flex flex-col items-center p-1.5 gap-2">
                            <input type="text" className="text-sm rounded-lg w-full pl-2 p-2 outline-none bg-[rgb(15,15,15)]" placeholder="Item name"/>
                            <textarea className="resize-none rounded-lg text-sm flex-grow-1 pl-2 p-1 outline-none w-full bg-[rgb(15,15,15)]" placeholder="Describe it better"></textarea>
                        </div>
                    </div>
                </div>
                <div className="mt-[-0.5rem]">
                    <label className="text-sm text-gray-300">Your whatsapp number</label><br/>
                    <div className="flex flex-row h-10 w-[70%] rounded-xl overflow-hidden">
                        <div className="h-10 w-12 flex-shrink-0 bg-green-500 flex flex-row items-center justify-center"><UserRound strokeWidth={2.5}/></div>
                        <input type="number" maxLength="11" className="pl-2 outline-none bg-[rgb(20,20,20)] flex-grow-1" placeholder="080xxxxxxxx"/>
                    </div>
                </div>
                <div className="">
                    <label className="text-sm text-gray-300">Where do you stay? <b>(optional)</b></label><br/>
                    <div className="flex flex-row h-10 w-[70%] rounded-xl overflow-hidden">
                        <div className="h-10 w-12 flex-shrink-0 bg-[orangered] flex flex-row items-center justify-center"><MapPin strokeWidth={2.5}/></div>
                        <input type="text" className="pl-2 outline-none bg-[rgb(20,20,20)] w-full" placeholder="Hostel/lodge?"/>
                    </div>
                </div>

                <div className="mt-3">
                    <label className="text-sm text-gray-300">What do you aim to receive?</label>
                    <div className="w-[80%] flex flex-row backdrop-blur-sm bg-[#000090]/15 border border-gray-900/70 rounded-2xl overflow-hidden">
                        <div className="flex-grow-1 flex flex-col items-center p-1.5 gap-2">
                            <div className="flex flex-row gap-3 items-center w-full">
                                <Package size={35}/>
                                <input type="text" className="text-sm rounded-lg w-full pl-2 p-2 outline-none bg-[rgb(15,15,15)]" placeholder="Item name"/>
                            </div>
                            <div className="flex flex-row gap-3 w-full">
                                <ScrollText size={35}/>
                                <textarea className="resize-none rounded-lg text-sm flex-grow-1 pl-2 p-1 outline-none w-full bg-[rgb(15,15,15)]" placeholder="Describe it better"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};