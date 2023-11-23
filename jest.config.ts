import type { Config } from "@jest/types";
// Sync object
const config: Config.InitialOptions = {
    setupFiles: ["jest-canvas-mock"],
    verbose: true,
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testEnvironment: "./tests/FixJSDOMEnvironment.ts",
    coveragePathIgnorePatterns: ["/node_modules/", "/src/controller/frames/weather/open-meteo-client", ".instance.ts"],
    coverageDirectory: "./reports/coverage",
    reporters: [["github-actions", { silent: false }], "default"],
};
export default config;
