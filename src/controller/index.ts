import { ConfigModel } from "../models/Config";
import { MainController } from "./Main";
import { SettingsPopupController } from "./SettingsPopup";

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register("/service-worker.js")
            .then((registration) => {
                console.log("SW registered: ", registration);
            })
            .catch((registrationError) => {
                console.log("SW registration failed: ", registrationError);
            });
    });
}

const config = new ConfigModel();
new MainController(config);
new SettingsPopupController(config);
