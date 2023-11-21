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

export class ConfigModel extends Model<Settings> {
    protected _config: Settings;
    constructor() {
        super(() => Promise.resolve(defaults));
        this._config = this.load();
        this.getData = this.getConfig.bind(this);
    }
    protected getConfig(): Promise<Settings> {
        return Promise.resolve(this.config);
    }
    get config(): Settings {
        return this._config;
    }
    set config(data: Settings) {
        this._config = data;
    }
    public save(): void {
        try {
            localStorage.setItem("config", JSON.stringify(this.config));
        } catch {
            // Do nothing, this is allowed to fail
        }
    }
    public load(): Settings {
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
    private assertIsSettings(value: any): asserts value is Settings {
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
