import { ClipLoader } from "react-spinners";

export default function Button({children, loading=false, variant, ...props}){
    return (
        <div className="bg-[#5a0019ff] w-full p-2 flex flex-col items-center rounded-sm">
            {loading ? <ClipLoader color="white" size={24}/>:<button className="w-full h-full" {...props}>{children}</button>}
        </div>
    );
};