import { ConfigModel } from "../models/Config";
import { MainController } from "./Main";
import { SettingsPopupController } from "./SettingsPopup";

if ("serviceWorker" in navigator) {
    void navigator.serviceWorker.register("./sw.js", { scope: "./" }).catch((err: Error) => {
        console.error(err.message);
    });
}

const config = new ConfigModel();
new MainController(config);
new SettingsPopupController(config);
