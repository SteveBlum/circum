import { ConfigModel } from "../models/Config";
import { MainController } from "./Main";
import { SettingsPopupController } from "./SettingsPopup";

const config = new ConfigModel();
new MainController(config);
new SettingsPopupController(config);
