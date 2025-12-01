import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";
const jiti = createJiti(fileURLToPath(import.meta.url));

// Runtime environment configuration validation
await jiti.import("./src/lib/config");

const nextConfig = {
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
