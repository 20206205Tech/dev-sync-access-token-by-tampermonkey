import { STORAGE_KEY } from "./config";
import { getCurrentHostEnv } from "./getCurrentHostEnv";

export function syncTokenToSwagger() {
  const currentHostEnv = getCurrentHostEnv();

  if (currentHostEnv && window.location.href.includes("/docs")) {
    const envSpecificKey = `${STORAGE_KEY}_${currentHostEnv}`;
    const sharedValue = GM_getValue(envSpecificKey);

    if (sharedValue) {
      const currentLocalValue = unsafeWindow.localStorage.getItem(STORAGE_KEY);

      if (currentLocalValue !== sharedValue) {
        unsafeWindow.localStorage.setItem(STORAGE_KEY, sharedValue);
        console.log(
          `%c✅ Đã đồng bộ Token [${currentHostEnv}] vào LocalStorage!`,
          "color: cyan; font-weight: bold;",
        );
        window.location.reload();
      }
    }
  }
}
