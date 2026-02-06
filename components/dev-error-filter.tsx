 "use client";
 
 import { useEffect } from "react";
 
 export default function DevErrorFilter() {
  useEffect(() => {
    const originalError = console.error;
    const originalLog = console.log;

    console.error = (...args: any[]) => {
      const msg = args?.[0] ? String(args[0]) : "";
      if (
        msg.includes("net::ERR_ABORTED") ||
        msg.includes("hmr-client") ||
        msg.includes("/api/auth/me")
      ) {
        return;
      }
      originalError(...args);
    };

    console.log = (...args: any[]) => {
      const msg = args?.[0] ? String(args[0]) : "";
      if (msg.includes("<no value>")) {
        return;
      }
      originalLog(...args);
    };
 
     const onError = (e: ErrorEvent) => {
       const m =
         e.message ||
         (e.error && (e.error as any).message) ||
         "";
       if (typeof m === "string" && m.includes("net::ERR_ABORTED")) {
         e.preventDefault();
       }
     };
 
     const onRejection = (e: PromiseRejectionEvent) => {
       const reason = e.reason as any;
       const name = reason?.name || "";
       const text = typeof reason === "string" ? reason : String(reason);
       if (name === "AbortError" || text.includes("AbortError")) {
         e.preventDefault();
       }
     };
 
     window.addEventListener("error", onError);
     window.addEventListener("unhandledrejection", onRejection);
     return () => {
      console.error = originalError;
      console.log = originalLog;
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
   }, []);
   return null;
 }
