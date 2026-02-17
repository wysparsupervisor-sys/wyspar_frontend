import { createAvatar } from "@dicebear/core";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import * as Collection from "@dicebear/collection";
import { produce } from "immer";




export default function Avatar({context}) {
    const [styleChoice, setStyleChoice] = useState("random");
    const [alreadyGenerated, setAlreadyGenerated] = useState(0);
    const { formInfo, setFormInfo } = context;

    //random seed and style generator
    const styles = ["adventurer", "adventurerNeutral", "avataaars", "avataaarsNeutral", "bigEars", "bigEarsNeutral", "bigSmile", "bottts", "botttsNeutral", "croodles", "croodlesNeutral", "dylan", "funEmoji", "glass", "icons", "identicon", "lorelei", "loreleiNeutral", "micah", "miniavs", "notionists", "notionistsNeutral", "openPeeps", "personas", "pixelArt", "pixelArtNeutral", "rings", "shapes", "thumbs" ];
    function getRandomStyle() {
        const randomIndex = Math.floor(Math.random() * styles.length);
        return styles[randomIndex];
    };
    function getRandomSeed() {
        return Math.random().toString(36).substring(2,17);
    };

    const [dataUri, setDataUri] = useState("/logo.png");

    const generateAvatar = () =>  {
        const style = formInfo.avatar.style && alreadyGenerated == 0 ? formInfo.avatar.style : styleChoice === "random" ? getRandomStyle() : styleChoice;
        setFormInfo(current => produce(current, draft => { draft.avatar.style = style }));

        const seed = formInfo.avatar.seed && alreadyGenerated == 0 ? formInfo.avatar.seed : getRandomSeed();
        setFormInfo(current => produce(current, draft => { draft.avatar.seed = seed }));
        setAlreadyGenerated(prev=>prev+1);

        const avatar = createAvatar(Collection[style], { seed: seed });
        setDataUri(avatar.toDataUri());
    };

    useEffect(() => {
        generateAvatar();
    }, []);

    return (
        <>
            <p className="text-sm text-gray-400 mb-2" style={{lineHeight: "1.3"}}>Generate your avatar.</p>
            <select className="bg-black w-full p-2 border border-gray-900 rounded-md outline-none" onChange={(e) => setStyleChoice(e.target.value)}>
                <option className="p-2" value="random">Random</option>
                {styles.map((style, i) =>  (
                    <option value={style} key={i}>{style}</option>
                ))}
            </select>
            <div className="flex w-full flex-row items-center justify-between pl-7 pr-7">
                <Image alt="select profile avater" src={dataUri} height={100} width={100} className="rounded-full bg-white border-2 border-gray-900"/>
                <RefreshCcw strokeWidth={1.6} size={50} onClick={() => generateAvatar()}/>
            </div>
        </>
    )
};