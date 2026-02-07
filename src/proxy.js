import { NextResponse } from "next/server";


export function proxy(req) {
    const token = req.cookies.get("user_access_token");

    const ungatedPaths = ["/login", "/signup", "/welcome", "/whisper/[post_base64_id]", "/recover"];
    const { pathname } = req.nextUrl;

    //redirect all root paths to welcome
    if(pathname === "/") return NextResponse.redirect(new URL("/welcome", req.url));

    //prevents checking for token when user tries to visit routes that do not require token
    const isUngated = ungatedPaths.some(path => pathname.startsWith(path));
   
    //if user is not signed in then redirect them to login
    if(!isUngated && !token) {
        const loginUrl = new URL("/login", req.url);
        return NextResponse.redirect(loginUrl);
    };

    if(["/login", "/signup", "/welcome"].includes(pathname) && token) {
        //if user is signed in then redirect them to profile
        return NextResponse.redirect(new URL("/me/profile", req.url));
    };

    return NextResponse.next();
};


export const config = { 
    //run middleware in anything except these routes and files
    matcher: ["/((?!_next|api|.*\\..*).*)"]
};