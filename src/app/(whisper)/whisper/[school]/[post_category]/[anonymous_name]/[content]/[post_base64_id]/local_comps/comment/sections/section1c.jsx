import Section1 from "../../sections/section1"
import Section2 from "../../sections/section2"
import Section3 from "../../sections/section3"
import Section4 from "../../sections/section4"


export default function Section1C({info}){ //c as in comment
    return (
        <div className="p-2 flex flex-col gap-2">
            <div className="h-[50px]">{/**compensate for height by top comment header element*/}</div>
            <Section1 info={info}/>
            <Section2 info={info}/>
            <Section4 info={info}/>
        </div>
    )
}