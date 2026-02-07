import { Calendar1 } from "lucide-react";
import Link from "next/link";

export default function ExpiryWarning(){
    return (
        <div className="p-2 pb-4">
            <div className="p-2 rounded-xl bg-red flex flex-col gap-3 bg-gradient-to-tr from-[#000030] via-[red]/30 to-black">
                <div className="flex flex-row items-center gap-2 text-white"><Calendar1 size={40}/><b className="text-lg">Subscription expired</b></div>
                <div className="text-sm p-3 rounded-xl bg-[rgb(15,15,15)]" style={{boxShadow:"inset 10px 10px 25px black"}}>
                    <b>Help keep the Wyspar community alive 💚</b>
                    <p>
                        Your support helps cover the costs of running and improving the platform 🚀 For just <b>NGN750 a month</b>. Roughly the price of a chilled Pepsi 🥤 and two hot buns 🥖🥖 you're helping keep  Wyspar going 🤝✨
                    </p>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <button className="w-full bg-black p-2 rounded-lg border-2 border-[#0a6464ff]"><Link href="/explore">Free feed</Link></button>
                    <button className="w-full bg-black p-2 rounded-lg border-2 border-[#000090]"><Link href="/manage">Subscribe</Link></button>
                </div>
            </div>
        </div>
   );
};