import { POST_CATEGORIES } from "@/app/lib/data/post-categories";
import Head from "next/head";

export default function OgMeta({og_obj}){
    return (
        <html>
            <Head>
                <title>{og_obj.content}</title>
                <meta property="og:title" content={og_obj.anonymous_name + "  " + POST_CATEGORIES[og_obj.post_category] + "  " + og_obj.school}/>
                <meta property="og:description" content={og_obj.content +  "...y. open wyspar now"}/>
                <meta property="og:image" content={og_obj.image}/>
            </Head>
            <body></body>
        </html>
    );
};