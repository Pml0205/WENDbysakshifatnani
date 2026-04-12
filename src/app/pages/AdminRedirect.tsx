import { useEffect, useMemo } from "react";

const DEFAULT_ADMIN_URL = "https://wendbysakshifatnani.onrender.com";
const LOCAL_ADMIN_URL = "http://localhost:3000";

const isLocalHost = (hostname: string) => {
  return hostname === "localhost" || hostname === "127.0.0.1";
};

export default function AdminRedirect() {
  const adminBaseUrl = useMemo(() => {
    const configuredUrl = import.meta.env.VITE_ADMIN_PANEL_URL?.trim();
    const hostBasedDefault =
      typeof window !== "undefined" && isLocalHost(window.location.hostname)
        ? LOCAL_ADMIN_URL
        : DEFAULT_ADMIN_URL;
    const base = configuredUrl || hostBasedDefault;
    return base.replace(/\/$/, "");
  }, []);

  const loginRedirectUrl = useMemo(() => new URL("/login", `${adminBaseUrl}/`).toString(), [adminBaseUrl]);

  useEffect(() => {
    // Redirect immediately
    window.location.replace(loginRedirectUrl);
  }, [loginRedirectUrl]);

  return null;
}
