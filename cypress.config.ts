import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        // setupNodeEvents(on, config)
        setupNodeEvents() {
            // implement node event listeners here
        },
    },
    reporter: "mochawesome",
    reporterOptions: {
        reportDir: "reports/e2e",
    },
});
