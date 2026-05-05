import { FRONTEND_URL } from "../../../../domain";


export default function OgMeta(){
    return (
        <html>
            <head>
                <title>Wyspar</title>
                <meta property="og:title" content="Wyspar, the social app for campus students."/>
                <meta property="og:description" content="Speak freely and meet new people that match your vibez!"/>
                <meta property="og:image" content={`${FRONTEND_URL}/logo.png`}/>
            </head>
            <body></body>
        </html>
    );
};