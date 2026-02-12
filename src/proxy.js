import { NextResponse } from "next/server";


export function proxy(req) {
    const { path } = req.nextUrl;
    const pathname = pathname.replace(/\/$/,  "") || "/";
    const token = req.cookies.get("user_access_token");
    const ungatedPaths = ["/login", "/signup", "/welcome", "/recover", "/welcome/"];
    const isUngated = ungatedPaths.some(path => pathname.startsWith(path));

    //redirect all root paths to welcome
    if(pathname === "/") return NextResponse.redirect(new URL("/welcome", req.url));
    
    if(pathname === "/welcome" || pathname === "/welcome/") return NextResponse.next();

    //if ppathname is a post preview and it's a robot viewing just allow them
    const uaString = req.headers.get('user-agent') || '';
    const isBot = /(bot|crawler|spider|slurp|facebookexternalhit|twitterbot|whatsapp)/i.test(uaString);
    if (pathname.startsWith("/whisper") && isBot) return NextResponse.next();
   
    //if user is not signed in then redirect them to login
    if(isUngated) {
        if(["/login", "/signup"].includes(pathname) && token) {
            //if user is signed in then redirect them to profile
            return NextResponse.redirect(new URL("/explore", req.url));
        };
        return NextResponse.next();
    };

    if(!token) {
        return NextResponse.redirect(new URL("/explore", req.url));
    };

    return NextResponse.next();
};


export const config = { 
    //run middleware in anything except these routes and files
    matcher: ["/((?!_next|api|.*\\..*).*)"]
};