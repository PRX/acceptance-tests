import { defineConfig } from "cypress";
import * as dotenvPlugin from "cypress-dotenv";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      return dotenvPlugin(config)
    },
  },
});
