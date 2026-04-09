import { ISS_MAP, STORAGE_KEY } from "./config";
import { parseJwt } from "./parseJwt";

export function processAndSaveToken() {
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
