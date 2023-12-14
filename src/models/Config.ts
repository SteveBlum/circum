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
};

export interface Settings {
    sites: Site[];
    rotationRate: number;
    useGlobalRotationRate: boolean;
    refreshRate: number;
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
        try {
            const storedConfig = localStorage.getItem("config");
            if (!storedConfig) {
                throw new Error("No config found in local storage");
            }
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const parsedStoredConfig = JSON.parse(storedConfig);
            this.assertIsSettings(parsedStoredConfig);
            return parsedStoredConfig;
        } catch {
            return defaults;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static assertIsSettings(value: any): asserts value is Settings {
        if (
            !("sites" in value) ||
            !("rotationRate" in value) ||
            !("useGlobalRotationRate" in value) ||
            !("refreshRate" in value)
        ) {
            throw new Error(`Saved config couldn't be parsed`);
        }
    }
}
