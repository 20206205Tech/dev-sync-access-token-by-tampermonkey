import { ENV_DEV, ENV_PROD } from "./config";

export function getCurrentHostEnv() {
  const host = window.location.hostname;
  if (host.includes("20206205.local")) return ENV_DEV;
  if (host.includes("20206205.tech")) {
    return host.startsWith("dev-") ? ENV_DEV : ENV_PROD;
  }
  return null;
}
