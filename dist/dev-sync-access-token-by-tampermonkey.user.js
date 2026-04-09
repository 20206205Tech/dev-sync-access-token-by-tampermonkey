// ==UserScript==
// @version      0.0.1
// @author       VuVanNghia
// @namespace    VuVanNghia
// @name          Dev Sync Access Token By Tampermonkey
// @description  Tampermonkey script for Dev Sync Access Token By Tampermonkey
// @homepageURL  https://github.com/20206205tech/dev-sync-access-token-by-tampermonkey
// @updateURL    https://github.com/20206205tech/dev-sync-access-token-by-tampermonkey/raw/build/dist/dev-sync-access-token-by-tampermonkey.user.js
// @downloadURL  https://github.com/20206205tech/dev-sync-access-token-by-tampermonkey/raw/build/dist/dev-sync-access-token-by-tampermonkey.user.js
// @match        https://20206205tech.github.io/*
// @match        *://*.20206205.tech/*
// @match        *://*.20206205.local/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=20206205.tech
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = "authorized";
  const ENV_DEV = "DEV";
  const ENV_PROD = "PROD";
  const ISS_MAP = {
    "https://cmtvbkvxwspkdstrcrfm.supabase.co/auth/v1": ENV_DEV,
    "https://subllhhvspwaseobtysd.supabase.co/auth/v1": ENV_PROD,
  };

  function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        window
          .atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join(""),
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }

  function processAndSaveToken() {
    let hashParams = new URLSearchParams(window.location.hash.substring(1));
    let queryParams = new URLSearchParams(window.location.search);
    let accessToken =
      hashParams.get("access_token") || queryParams.get("access_token");

    if (!accessToken) return;

    const payload = parseJwt(accessToken);
    const tokenEnv = ISS_MAP[payload?.iss];

    if (tokenEnv) {
      console.log(
        `%c🟢 Tìm thấy Token môi trường: ${tokenEnv}`,
        "color: green; font-weight: bold;",
      );

      const authData = {
        Bearer: {
          name: "Bearer",
          schema: {
            scheme: "bearer",
            bearerFormat: "JWT",
            type: "http",
            in: "header",
          },
          value: accessToken,
        },
      };

      const valueToSave = JSON.stringify(authData);
      const envSpecificKey = `${STORAGE_KEY}_${tokenEnv}`;

      GM_setValue(envSpecificKey, valueToSave);
      alert(`✅ Đã lưu Token ${tokenEnv} vào bộ nhớ tạm!`);
    }
  }

  function getCurrentHostEnv() {
    const host = window.location.hostname;
    if (host.includes("20206205.local")) return ENV_DEV;
    if (host.includes("20206205.tech")) {
      return host.startsWith("dev-") ? ENV_DEV : ENV_PROD;
    }
    return null;
  }

  function syncTokenToSwagger() {
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

  function main() {
    processAndSaveToken();
    syncTokenToSwagger();
  }

  main();

})();
