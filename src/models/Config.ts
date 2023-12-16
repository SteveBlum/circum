import { CustomToast } from "../controller/Toast";
import { Model } from "./model";

export interface Site {
    url: string;
    rotationRate: number;
}

export const defaults: Settings = {
    sites: [
        { url: "./frames/clock.html", rotationRate: 60 },
        { url: "./frames/weather.html", rotationRate: 60 },
    ],
    useGlobalRotationRate: true,
    rotationRate: 60,
    refreshRate: 600,
    wakeLock: false,
};

export interface Settings {
    sites: Site[];
    rotationRate: number;
    useGlobalRotationRate: boolean;
    refreshRate: number;
    wakeLock: boolean;
}

export class ConfigModel extends Model<() => Settings> {
    constructor() {
        super(ConfigModel.getterFunction(ConfigModel.load()));
    }
    protected static getterFunction(config: Settings): () => Settings {
        return () => config;
    }
    get config(): Settings {
        // The getter function of this class really can't fail
        /* istanbul ignore next */
        if (this.data instanceof Error) {
            throw this.data;
        }
        return this.data;
    }
    set config(data: Settings) {
        this.getData = ConfigModel.getterFunction(data);
    }
    public save(): void {
        try {
            localStorage.setItem("config", JSON.stringify(this.config));
        } catch {
            // Do nothing, this is allowed to fail
        }
    }
    public static load(): Settings {
        const storedConfig = localStorage.getItem("config");
        if (!storedConfig) {
            new CustomToast(
                "warning",
                `No saved config was found for ${document.URL}, defaults config are loaded instead`,
                "Loading settings",
                "Warning",
            );
            return defaults;
        }
        let parsedStoredConfig: unknown;
        try {
            parsedStoredConfig = JSON.parse(storedConfig);
        } catch {
            new CustomToast(
                "error",
                "Saved config couldn't be parsed, defaults config are loaded instead",
                "Settings import",
                "Error",
            );
            return defaults;
        }
        try {
            this.assertIsSettings(parsedStoredConfig);
        } catch {
            new CustomToast(
                "error",
                "Saved config is invalid, defaults config are loaded instead",
                "Settings import",
                "Error",
            );
            return defaults;
        }
        return parsedStoredConfig;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static assertIsSettings(value: any): asserts value is Settings {
        if (
            !("sites" in value) ||
            !("rotationRate" in value) ||
            !("useGlobalRotationRate" in value) ||
            !("refreshRate" in value) ||
            !("wakeLock" in value)
        ) {
            throw new Error(`Saved config couldn't be parsed`);
        }
    }
}
