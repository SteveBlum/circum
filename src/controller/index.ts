import { ConfigModel } from "../models/Config";
import { MainController } from "./Main";
import { SettingsPopupController } from "./SettingsPopup";

const subPath = window.location.pathname.split("/").slice(0, -1).join("/");

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker
            .register(`${subPath}/service-worker.js`, { scope: `${subPath}/` })
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
