import { useEffect, useMemo } from "react";

const LOCAL_ADMIN_URL = "http://localhost:3000";
const PROD_ADMIN_URL = "https://api.wendbysakshifatnani.in";

const isLocalHost = (hostname: string) => {
  return hostname === "localhost" || hostname === "127.0.0.1";
};

export default function AdminRedirect() {
  const adminBaseUrl = useMemo(() => {
    if (typeof window === "undefined") {
      return PROD_ADMIN_URL;
    }
    
    const envUrl = import.meta.env.VITE_ADMIN_PANEL_URL;
    const configuredUrl = envUrl ? envUrl.trim() : undefined;
    const hostBasedDefault = isLocalHost(window.location.hostname)
      ? LOCAL_ADMIN_URL
      : PROD_ADMIN_URL;
    const base = configuredUrl || hostBasedDefault;
    console.log("Admin Panel URL Base:", base);
    return base.replace(/\/$/, "");
  }, []);

  useEffect(() => {
    if (!adminBaseUrl) return;
    
    try {
      const loginUrl = new URL("/login", `${adminBaseUrl}/`).toString();
      console.log("Redirecting to:", loginUrl);
      window.location.replace(loginUrl);
    } catch (error) {
      console.error("Failed to construct redirect URL:", error);
      // Fallback redirect
      window.location.href = `${adminBaseUrl}/login`;
    }
  }, [adminBaseUrl]);

  return null;
}
