"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import Tools from "./components/layout/tools";
import { useEffect, useRef, useState } from "react";
import "@/services/interaction"; //necessary to track and update user post interactions across routes
import { useScrollStore } from "./store";
import { GetFromSessionStorage, SaveToSessionStorage } from "./lib/utils/session-storage";
import Request from "./lib/utils/request";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  //register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register("/sw.js").then(reg => console.log('Service worker registered', reg)).catch(err => console.log('Sw registration failed', err));
    };
  }, []);

  //monitor number of times app was opened
  useEffect(() => {
    const opened = GetFromSessionStorage("opened");
    if (!opened) {
      SaveToSessionStorage("opened", "hi", 1000 * 60 * 60 * 24);
      Request("/app/user/me/analytics?action=dau", "POST", {});
    };
  }, []);

  const pathname = usePathname();
  const scrollListen = useScrollStore((state) => state.scrollListen);

  const [hidden, setHidden] = useState(false);
  const containerRef = useRef(null);
  const lastScroll = useRef(0);

  useEffect(() => {
      const el = scrollListen?.current ?? containerRef.current;
      if(!el) return;
      let ticking = false;

      function onScroll(){
          if(!ticking) {
            window.requestAnimationFrame(() => {
              const scrollTop = el.scrollTop;
              const scrollHeight = el.scrollHeight;
              const clientHeight = el.clientHeight;

              const atBottom = scrollTop + clientHeight >= scrollHeight - 2;
              const atTop = scrollTop <= 2;

              if(!atBottom && !atTop) {
                const delta = scrollTop - lastScroll.current;
                if(Math.abs(delta) > 2) {
                  setHidden(delta > 0);
                };
              };

              lastScroll.current = scrollTop;
              ticking = false;
            });
            ticking = true;
          };
      };

      el.addEventListener("scroll", onScroll, { passive: true });
      return () => el.removeEventListener("scroll", onScroll);
  }, [scrollListen]);

  //list of all routes that require nav & heaader
  const pagesWithNav = ["/me/profile", "/explore", "/manage"];
  const shouldShowNav = pagesWithNav.includes(pathname);

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json"/>
        <link rel="apple-touch-icon" href="/icon-192.png"/>
      </head>
      <body
        className={`h-screen max-h-[100dvh] ${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <div className="relative flex flex-col h-full max-h-[100dvh] w-screen">
          {shouldShowNav && <Tools className={`transition-all duration-500 ${hidden? "opacity-0 pointer-events-none":"opacity-100 pointer-events-auto"}`}/>}
          <div ref={containerRef} className="h-full w-full overflow-y-scroll">
            {children}
          </div>
          {shouldShowNav && <Footer className={`transition-all duration-300 ${hidden? "bottom-[-60px]":"bottom-0"}`}/>}
          {shouldShowNav && <Header className={`transition-all duration-300 ${hidden? "top-[-60px]":"top-0"}`}/>}
        </div>
      </body>
    </html>
  );
}
