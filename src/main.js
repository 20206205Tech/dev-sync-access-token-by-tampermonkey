import { processAndSaveToken } from "./processAndSaveToken";
import { syncTokenToSwagger } from "./syncTokenToSwagger";

function main() {
  processAndSaveToken();
  syncTokenToSwagger();
}

main();
