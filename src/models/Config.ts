import { CustomToast } from "../controller/Toast";
import { Model } from "./model";

/** Metadata and configuration of websites which are displayed as iframes within circum */
export interface Site {
    /** iframe URL */
    url: string;
    /** Number of seconds for which this iframe should be displayed */
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

/** Main circum configuration object */
export interface Settings {
    /** Array of websites to display as iframes */
    sites: Site[];
    /**
     * Number of seconds to display each iframe
     * Only applies if useGlobalRotationRate is set to true
     * Will overwrite site-specific rotationRates
     */
    rotationRate: number;
    /** Controls if either the global rotation rates should overwrite individual, site-specifc rotation rates */
    useGlobalRotationRate: boolean;
    /** Number of seconds until every iframe is reloaded to keep connections active */
    refreshRate: number;
    /** Flag to keep the screen of mobile devices active */
    wakeLock: boolean;
}

/**
 * A model to manage Configuration of circum
 */
export class ConfigModel extends Model<() => Settings> {
    // Nothing really to say here
    // eslint-disable-next-line jsdoc/require-jsdoc
    constructor() {
        super(ConfigModel.getterFunction(ConfigModel.load()));
    }
    protected static getterFunction(config: Settings): () => Settings {
        return () => config;
    }
    /**
     * Gets the current configuration using the getter function
     * If getter function returns an Error, it is thrown
     */
    get config(): Settings {
        // The getter function of this class really can't fail
        /* istanbul ignore next */
        if (this.data instanceof Error) {
            throw this.data;
        }
        return this.data;
    }
    /**
     * Replaces the getter function with a new one which returns the provided configuration
     * @param data - New configuration
     */
    set config(data: Settings) {
        this.getData = ConfigModel.getterFunction(data);
    }
    /**
     * Writes the current configuration to local storage
     */
    public save(): void {
        try {
            localStorage.setItem("config", JSON.stringify(this.config));
        } catch {
            // Do nothing, this is allowed to fail
        }
    }
    /**
     * Loads configuration from local storage, if it was previously stored there by the save() function
     * In case it doesn't yet exist or any issue comes up, the user is notified and default settings are used instead
     */
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
    /**
     * Ensures the given value contains a valid configuration object
     */
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
