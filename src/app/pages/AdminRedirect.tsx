import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

const DEFAULT_ADMIN_URL = "https://wendbysakshifatnani.onrender.com";
const LOCAL_ADMIN_URL = "http://localhost:3000";

const isLocalHost = (hostname: string) => {
  return hostname === "localhost" || hostname === "127.0.0.1";
};

export default function AdminRedirect() {
  const location = useLocation();

  const adminBaseUrl = useMemo(() => {
    const configuredUrl = import.meta.env.VITE_ADMIN_PANEL_URL?.trim();
    const hostBasedDefault =
      typeof window !== "undefined" && isLocalHost(window.location.hostname)
        ? LOCAL_ADMIN_URL
        : DEFAULT_ADMIN_URL;
    const base = configuredUrl || hostBasedDefault;
    return base.replace(/\/$/, "");
  }, []);

  const loginRedirectUrl = useMemo(() => {
    const pathAfterAdmin = location.pathname.replace(/^\/admin/, "");
    const normalizedPath = pathAfterAdmin
      ? pathAfterAdmin.startsWith("/")
        ? pathAfterAdmin
        : `/${pathAfterAdmin}`
      : "/";
    const nextPath = `${normalizedPath}${location.search}${location.hash}`;

    const loginUrl = new URL("/login", `${adminBaseUrl}/`);
    loginUrl.searchParams.set("forceLogin", "1");
    if (nextPath && nextPath !== "/") {
      loginUrl.searchParams.set("next", nextPath);
    }

    return loginUrl.toString();
  }, [adminBaseUrl, location.hash, location.pathname, location.search]);

  useEffect(() => {
    // Redirect immediately
    window.location.href = loginRedirectUrl;
  }, [loginRedirectUrl]);

  return null;
}
