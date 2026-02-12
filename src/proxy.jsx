import { NextResponse } from "next/server";


export function proxy(req) {
    const { pathname } = req.nextUrl;

    //if ppathname is a post preview and it's a robot viewing just allow them
    const uaString = req.headers.get('user-agent') || '';
    const isBot = /(bot|crawler|spider|slurp|facebookexternalhit|twitterbot|whatsapp)/i.test(uaString);
    if (pathname.startsWith("/whisper") && isBot) return NextResponse.next();
    if (pathname.startsWith("/welcome")) return NextResponse.next();

    const token = req.cookies.get("user_access_token");
    const ungatedPaths = ["/login", "/signup", "/welcome", "/recover"];

    //redirect all root paths to welcome
    if(pathname === "/") return NextResponse.redirect(new URL("/welcome", req.url));

    //prevents checking for token when user tries to visit routes that do not require token
    const isUngated = ungatedPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));
   
    //if user is not signed in then redirect them to login
    if(!isUngated && !token) {
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    };

    if(["/login", "/signup"].includes(pathname) && token) {
        //if user is signed in then redirect them to profile
        return NextResponse.redirect(new URL("/explore", req.url));
    };

    return NextResponse.next();
};


export const config = { 
    //run middleware in anything except these routes and files
    matcher: ["/((?!_next|api|.*\\..*).*)"]
};