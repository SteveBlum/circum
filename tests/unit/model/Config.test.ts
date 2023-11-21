/* eslint-disable @typescript-eslint/no-unsafe-call */
import { defaults, ConfigModel } from "../../../src/models/Config";

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
            const model = new ConfigModel();
            localStorage.setItem(
                "config",
                '{"sites":[{"url":"./frames/clock.html","rotationRate":60},{"url":"./frames/weather.html","rotationRate":60}],"useGlobalRotationRate":true,"rotationRate":60,"refreshRate":6000}',
            );
            expect(model.load().refreshRate).toBe(6000);
        });
        it("Returns default values if saved config is invalid JSON", () => {
            const model = new ConfigModel();
            localStorage.setItem("config", "invalid");
            expect(model.load()).toStrictEqual(defaults);
        });
        it("Returns default values if saved config doesn't exist", () => {
            const model = new ConfigModel();
            localStorage.removeItem("config");
            expect(model.load()).toStrictEqual(defaults);
        });
        it("Returns default values if saved config type is incompatible", () => {
            const model = new ConfigModel();
            localStorage.setItem("config", '{ "someValue": 20}');
            expect(model.load()).toStrictEqual(defaults);
        });
    });
});
