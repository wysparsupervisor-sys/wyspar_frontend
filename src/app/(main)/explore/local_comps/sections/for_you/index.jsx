import { useCampusTodayStore } from "../../stores/campus-today";
import CampusSpace from "./sub_sections/campus-space";
import CampusToday from "./sub_sections/campus-today";

export default function ForYouPage(){
    const forYouState = useCampusTodayStore((state) => state.forYouState);
    return (
        <>
            {forYouState === "campus-today" && <CampusToday/>}
            {forYouState === "campus-space" && <CampusSpace/>}
        </>
    );
};