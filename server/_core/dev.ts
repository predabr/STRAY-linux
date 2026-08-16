import { startServer } from "./index";
import { setupVite } from "./vite";

startServer(setupVite).catch(console.error);
