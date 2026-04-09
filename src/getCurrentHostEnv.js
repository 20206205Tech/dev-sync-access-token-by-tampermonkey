import { ENV_DEV, ENV_PROD } from "./config";

export function getCurrentHostEnv() {
  const host = window.location.hostname;
  if (host.includes("toeichust.local")) return ENV_DEV;
  if (host.includes("toeichust.me")) {
    return host.startsWith("dev-") ? ENV_DEV : ENV_PROD;
  }
  return null;
}
