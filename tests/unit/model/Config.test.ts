/* eslint-disable @typescript-eslint/no-unsafe-call */
import { defaults, ConfigModel, Settings } from "../../../src/models/Config";

describe("Config Model class", () => {
    describe("Save", () => {
        it("Saves to localStorage", () => {
            const model = new ConfigModel();
            model.save();
            expect(localStorage.getItem("config")).toStrictEqual(JSON.stringify(defaults));
        });
    });
    describe("load", () => {
        it("Returns saved config from localStorage", () => {
            localStorage.setItem(
                "config",
                '{"sites":[{"url":"./frames/clock.html","rotationRate":60},{"url":"./frames/weather.html","rotationRate":60}],"useGlobalRotationRate":true,"rotationRate":60,"refreshRate":6000,"wakeLock":false}',
            );
            expect(ConfigModel.load().refreshRate).toBe(6000);
        });
        it("Returns default values if saved config is invalid JSON", () => {
            localStorage.setItem("config", "invalid");
            expect(ConfigModel.load()).toStrictEqual(defaults);
        });
        it("Returns default values if saved config doesn't exist", () => {
            localStorage.removeItem("config");
            expect(ConfigModel.load()).toStrictEqual(defaults);
        });
        it("Returns default values if saved config type is incompatible", () => {
            localStorage.setItem("config", '{ "someValue": 20}');
            expect(ConfigModel.load()).toStrictEqual(defaults);
        });
        it("Non-default config is immediately loaded", () => {
            localStorage.setItem(
                "config",
                JSON.stringify({
                    sites: [{ url: "./frames/clock.html", rotationRate: 60 }],
                    useGlobalRotationRate: true,
                    rotationRate: 70,
                    refreshRate: 700,
                    wakeLock: false,
                }),
            );
            const model = new ConfigModel();
            const res = model.data;
            expect((res as Settings).refreshRate).toBe(700);
        });
    });
});
