import { POST_CATEGORIES } from "@/app/lib/data/post-categories";
import { useUserStore } from "../stores/user";



export default function Section3(){
    const postCategory = useUserStore((state) => state.postCategory);
    const updatePostCategory = useUserStore((state) => state.updatePostCategory)
    const types = POST_CATEGORIES;

    function Nav({name=""}){
        return(
            <b onClick={() => updatePostCategory(name)} className={`p-0.5 ${postCategory===name && "border-2 border-gray-800"} pl-5 pr-5 bg-[#000030] flex-shrink-0 rounded-xl`}>{name}</b>
        );
    };


    return (
        <>
            
        </>
    );
};