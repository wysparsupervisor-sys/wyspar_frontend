import { ImageResponse } from "next/og";
import { FRONTEND_URL } from "../../../../domain";


export async function GET(request){
    const { searchParams } = new URL(request.url);
    const purpose = searchParams.get("purpose");
    const location = searchParams.get("location");
    const phone = searchParams.get("phone");
    const school = searchParams.get("school");

    return new ImageResponse( 
        (
            <div style={{display:"flex", flexDirection:"column", justifyContent:"space-between", width:"100%", height:"100%", background:"#000000"}}>
                <img src={`${FRONTEND_URL}/logo.png`} style={{position:"absolute", top: 0, left:0, width: "100%", height:"100%", objectFit:"cover", opacity:0.07}}/>
                <div style={{display: "flex", flexDirection:"row", justifyContent:"space-between", width:"100%", fontSize:"3rem", color:"white", padding:"2rem"}}>
                    <b style={{background:"red", padding:"2px 2rem 2px 2rem", borderRadius: "12rem", fontWeight:"900"}}>{school || "Futo"}</b>
                    <b style={{background:"#000070", padding:"2px 2rem 2px 2rem", borderRadius: "12rem", fontWeight:"900"}}>{location || "Eziobodo"}</b>
                </div>
                <div style={{width:"100%", fontSize:"4rem", color:"white", textAlign:"center", padding:"2rem", display:"flex"}}>
                    I'm looking for someone {purpose || "to join me on a picnic to made in socs"}
                </div>
                <div style={{display: "flex", flexDirection:"row", justifyContent:"space-between", width:"100%", color:"white", padding:"2rem", alignItems:"center"}}>
                    <b style={{fontSize:"3rem"}}>@wyspar.com</b>
                    <b style={{padding:"2px 1rem 2px 1rem", borderRadius: "12rem", fontSize:"3rem",}}>+{phone || "no number"}</b>
                </div>
            </div>
        ), 
        { width: 900, height: 630 }
    )
}