import { FRONTEND_URL } from "../../../../../domain";

export default function OgMeta({og_obj}){
    return (
        <html>
            <head>
                <title>Connect with them!</title>
                <meta property="og:title" content={"I'm looking for someone " + og_obj.purpose}/>
                <meta property="og:description" content={og_obj.extra}/>
                <meta property="og:image" content={`${FRONTEND_URL}/api/og?purpose=${encodeURIComponent(og_obj.purpose)}&school=${"Futo"}&location=${encodeURIComponent(og_obj.location)}&phone=${encodeURIComponent(og_obj.phone)}`}/>
            </head>
            <body></body>
        </html>
    );
};