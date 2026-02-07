"use client";
import { createAvatar } from "@dicebear/core";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import * as Collection from "@dicebear/collection";




export default function ChooseAvatar({setAvatar, preventChange=false}) {
    const [styleChoice, setStyleChoice] = useState("random");
       
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
        if(preventChange) return;  //prevents  user from chooosing anooother avatar when seending a request to server

        const style = styleChoice === "random" ? getRandomStyle() : styleChoice;
        const seed = getRandomSeed();
        
        const avatar = createAvatar(Collection[style], { seed: seed });
        setDataUri(avatar.toDataUri());

        if(setAvatar) setAvatar({seed: seed, style: style });
    };

    useEffect(() => {
        generateAvatar();
    }, []);

    return (
        <>
            <select disabled={preventChange} className="bg-black w-full p-2 border border-gray-900 rounded-md outline-none" onChange={(e) => setStyleChoice(e.target.value)}>
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