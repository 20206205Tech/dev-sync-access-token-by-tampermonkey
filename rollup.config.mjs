import { HEADER } from "./src/header.js";

export default {
  input: "src/main.js",
  output: {
    file: `dist/dev-sync-access-token-by-tampermonkey.user.js`,
    format: "iife",
    banner: HEADER,
  },
};
