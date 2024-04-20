/* eslint-disable @typescript-eslint/no-unsafe-call */
import { SettingsPopupController } from "../../../src/controller/SettingsPopup";
import { ConfigModel, Settings } from "../../../src/models/Config";

const config: Settings = {
    sites: [
        { url: "./frames/clock.html", rotationRate: 60 },
        { url: "./frames/weather.html", rotationRate: 60 },
    ],
    useGlobalRotationRate: true,
    rotationRate: 60,
    refreshRate: 600,
    wakeLock: false,
};

describe("Settings Popup Controller", () => {
    class TestController extends SettingsPopupController {
        get configObject(): Settings {
            return this.config;
        }
        get unsavedConfigObject(): Settings {
            return this.unsavedConfig;
        }
        set unsavedConfigObject(config: Settings) {
            this.unsavedConfig = config;
        }
        public addListener(): void {
            return;
        }
        public addListenerOriginal(): void {
            super.addListener();
        }
        public getTableColumnIndex(headerId: string): number {
            return super.getTableColumnIndex(headerId);
        }
    }
    let controller: TestController;
    let configModel: ConfigModel;
    beforeEach(() => {
        configModel = new ConfigModel();
        document.body.innerHTML =
            '<div class="modal" id="settings"></div>' +
            '<input id="refreshRateSlider" type="range" class="form-range" min="0" max="3600" step="10">' +
            '<p id="refreshRate">10</p>' +
            '<input class="form-check-input" type="checkbox" id="useGlobalRotationRateCheckBox">' +
            '<input id="rotationRateSlider" type="range" class="form-range" min="0" max="3600" step="10">' +
            '<div id="rotationRateDiv" class="mb-3 mt-3"/>' +
            '<p id="rotationRate">10</p>' +
            '<table id="frameTable"><thead><tr>' +
            '<th id="frameUrlHeader">URL</th><th id="frameRotationRateHeader">RotationRate</th><th id="frameStatusHeader">Status</th>' +
            '<th id="frameMoveHeader">Move Frame</th><th id="frameRemoveHeader">Remove</th>' +
            "</tr></thead><tbody></tbody></table>" +
            '<button id="discardConfigButton" type="button">Close</button>' +
            '<button id="saveConfigButton" type="button">Save</button>' +
            '<a id="exportConfigButton" role="button" download="settings.json">Export</a>' +
            '<input id="importConfigInput" type="file" />' +
            '<button id="importConfigButton"><p id="import-error" hidden="true"/><p id="import-success" hidden="true"/>Upload</button>' +
            '<button id="addFrameButton" type="button"></button>' +
            '<input class="form-check-input" type="checkbox" id="wakeLockCheckBox">';
        controller = new TestController(configModel);
    });
    describe("constructor", () => {
        it("Default config is used if no argument is given", () => {
            const mainController = new SettingsPopupController(configModel);
            const res = mainController.config;
            expect(res).toStrictEqual(config);
        });
        it("Triggers refresh action", () => {
            const mockRefresh = jest.fn().mockImplementation();
            class ConfigTestController extends TestController {
                public async refresh(): Promise<void> {
                    await mockRefresh();
                }
            }
            controller = new ConfigTestController(configModel);
            expect(mockRefresh).toHaveBeenCalledTimes(1);
        });
    });
    describe("config", () => {
        it("Getter returns config from model", () => {
            const res = controller.config;
            expect(res).toStrictEqual(config);
        });
        it("Setter changes the config in model", () => {
            const newConfig = {
                sites: [
                    { url: "./frames/clock.html", rotationRate: 60 },
                    { url: "./frames/weather.html", rotationRate: 60 },
                ],
                useGlobalRotationRate: true,
                rotationRate: 61,
                refreshRate: 601,
                wakeLock: false,
            };
            controller.config = newConfig;
            const res = controller.config;
            expect(res).toStrictEqual(newConfig);
        });
        it("Setter triggers refresh action", () => {
            const mockRefresh = jest.fn();
            class ConfigTestController extends TestController {
                public async refreshView(): Promise<void> {
                    await mockRefresh();
                }
            }
            controller = new ConfigTestController(configModel);
            expect(mockRefresh).toHaveBeenCalledTimes(1);
            controller.config = {
                sites: [
                    { url: "./frames/clock.html", rotationRate: 60 },
                    { url: "./frames/weather.html", rotationRate: 60 },
                ],
                useGlobalRotationRate: true,
                rotationRate: 60,
                refreshRate: 600,
                wakeLock: false,
            };
            expect(mockRefresh).toHaveBeenCalledTimes(2);
        });
    });
    describe("refresh", () => {
        it("Keeps provided configuration", async () => {
            await controller.refresh();
            const res = controller.config;
            expect(res).toStrictEqual(config);
        });
    });
    describe("refreshView", () => {
        beforeEach(() => {
            controller = new TestController(configModel);
        });
        it("Doesn't update the original configuration", () => {
            const newConfig = {
                sites: [
                    { url: "./frames/clock.html", rotationRate: 60 },
                    { url: "./frames/weather.html", rotationRate: 60 },
                ],
                useGlobalRotationRate: true,
                rotationRate: 61,
                refreshRate: 600,
                wakeLock: false,
            };
            controller.refreshView(newConfig);
            expect(controller.configObject).toStrictEqual(controller.config);
        });
        it("Throws error if provided with one", () => {
            expect(() => {
                controller.refreshView(new Error("Test"));
            }).toThrowError("Test");
        });
        it("frame management table should have records of configured frames", () => {
            controller.refreshView(config);
            const records = controller.frameTable.get().tBodies[0];
            expect(records.children.length).toBe(2);
            expect(records.children[0].id).toBe("frame0");
        });
        it("frame management records should update unsaved configuration when url is being typed in", () => {
            controller.refreshView(config);
            expect(controller.unsavedConfigObject.sites[0].url).toBe("./frames/clock.html");
            const record = controller.frameTable.get().tBodies[0].children[0];
            (record.children[0] as HTMLTableCellElement).textContent = "./some.html";
            record.children[0].dispatchEvent(new Event("input"));
            expect(controller.unsavedConfigObject.sites[0].url).toBe("./some.html");
        });
        it("frame management url cell input event won't change the config if its text value is null", () => {
            controller.refreshView(config);
            expect(controller.unsavedConfigObject.sites[0].url).toBe("./frames/clock.html");
            const frameUrlCell = controller.element("frame0-url").get();
            frameUrlCell.textContent = null;
            frameUrlCell.dispatchEvent(new Event("input"));
            expect(controller.unsavedConfigObject.sites[0].url).toBe("./frames/clock.html");
        });
        it("frame management url cell focusout event will check the URL for validity and display the status accorindingly", () => {
            controller.refreshView(config);
            const frameUrlCell = controller.element("frame0-url").get();
            frameUrlCell.textContent = "https://some.validurl.com";
            frameUrlCell.dispatchEvent(new Event("focusout"));
            const frameStatusSuccess = controller.element("frame0-status-success").get();
            const frameStatusError = controller.element("frame0-status-error").get();
            expect(frameStatusError.hidden).toBe(true);
            expect(frameStatusSuccess.hidden).toBe(false);
        });
        it("frame management url cell focusout event will display an error status in case of an invalid URL", () => {
            controller.refreshView(config);
            const frameUrlCell = controller.element("frame0-url").get();
            frameUrlCell.textContent = "https:::invalid.url";
            frameUrlCell.dispatchEvent(new Event("focusout"));
            const frameStatusSuccess = controller.element("frame0-status-success").get();
            const frameStatusError = controller.element("frame0-status-error").get();
            expect(frameStatusError.hidden).toBe(false);
            expect(frameStatusSuccess.hidden).toBe(true);
        });
        it("frame management url cell focusout event will display an error status in case the URL is empty", () => {
            controller.refreshView(config);
            const frameUrlCell = controller.element("frame0-url").get();
            frameUrlCell.textContent = null;
            frameUrlCell.dispatchEvent(new Event("focusout"));
            const frameStatusSuccess = controller.element("frame0-status-success").get();
            const frameStatusError = controller.element("frame0-status-error").get();
            expect(frameStatusError.hidden).toBe(false);
            expect(frameStatusSuccess.hidden).toBe(true);
        });
        it("frame management remove button will remove the respective frame from the unsaved config, but not (yet) the saved config", () => {
            controller.refreshView(config);
            expect(controller.unsavedConfigObject.sites.length).toBe(2);
            expect(controller.unsavedConfigObject.sites[0].url).toBe("./frames/clock.html");
            const removeFrameButton = controller.typedElement("frame0-removeButton", "button").get();
            removeFrameButton.click();
            expect(controller.unsavedConfigObject.sites.length).toBe(1);
            expect(controller.unsavedConfigObject.sites[0].url).toBe("./frames/weather.html");
        });
        it("frame management move up button will move the respective frame up in the list, but not (yet) in the saved config", () => {
            controller.refreshView(config);
            expect(controller.unsavedConfigObject.sites[0].url).toBe("./frames/clock.html");
            expect(controller.configObject.sites[0].url).toBe("./frames/clock.html");
            const button = controller.typedElement("frame1-moveUpButton", "button").get();
            button.click();
            expect(controller.unsavedConfigObject.sites[0].url).toBe("./frames/weather.html");
            expect(controller.configObject.sites[0].url).toBe("./frames/clock.html");
        });
        it("frame management move up button won't change anything if the record is already all the way up", () => {
            controller.refreshView(config);
            expect(controller.unsavedConfigObject.sites[0].url).toBe("./frames/clock.html");
            const button = controller.typedElement("frame0-moveUpButton", "button").get();
            button.click();
            expect(controller.unsavedConfigObject.sites[0].url).toBe("./frames/clock.html");
        });
        it("frame management move down button will move the respective frame down in the list, but not (yet) in the saved config", () => {
            controller.refreshView(config);
            expect(controller.unsavedConfigObject.sites[1].url).toBe("./frames/weather.html");
            expect(controller.configObject.sites[1].url).toBe("./frames/weather.html");
            const button = controller.typedElement("frame0-moveDownButton", "button").get();
            button.click();
            expect(controller.unsavedConfigObject.sites[1].url).toBe("./frames/clock.html");
            expect(controller.configObject.sites[1].url).toBe("./frames/weather.html");
        });
        it("frame management move down button won't change anything if the record is already all the way down", () => {
            controller.refreshView(config);
            expect(controller.unsavedConfigObject.sites[1].url).toBe("./frames/weather.html");
            const button = controller.typedElement("frame1-moveDownButton", "button").get();
            button.click();
            expect(controller.unsavedConfigObject.sites[1].url).toBe("./frames/weather.html");
        });
    });
    describe("Element getters", () => {
        beforeEach(() => {
            controller = new TestController(configModel);
        });
        it("modal - positive test", () => {
            expect(() => controller.modal.get()).not.toThrowError();
            expect(controller.modal.get().id).toBe("settings");
        });
        it("modal - negative test", () => {
            document.body.innerHTML = "";
            expect(() => controller.modal.get()).toThrowError("Element settings, type div couldn't be found");
        });
        it("refreshRateSlider - positive test", () => {
            expect(() => controller.refreshRateSlider.get()).not.toThrowError();
            expect(controller.refreshRateSlider.get().id).toBe("refreshRateSlider");
        });
        it("refreshRateSlider - negative test", () => {
            document.body.innerHTML = "";
            expect(() => controller.refreshRateSlider.get()).toThrowError(
                "Element refreshRateSlider, type input couldn't be found",
            );
        });
        it("refreshRateText - positive test", () => {
            expect(() => controller.refreshRateText).not.toThrowError();
            expect(controller.refreshRateText.id).toBe("refreshRate");
        });
        it("refreshRateText - negative test", () => {
            document.body.innerHTML = "";
            expect(() => controller.refreshRateText).toThrowError("Element refreshRate, type p couldn't be found");
        });
        it("rotationRateSlider - positive test", () => {
            expect(() => controller.rotationRateSlider.get()).not.toThrowError();
            expect(controller.rotationRateSlider.get().id).toBe("rotationRateSlider");
        });
        it("rotationRateSlider - negative test", () => {
            document.body.innerHTML = "";
            expect(() => controller.rotationRateSlider.get()).toThrowError(
                "Element rotationRateSlider, type input couldn't be found",
            );
        });
        it("rotationRateText - positive test", () => {
            expect(() => controller.rotationRateText).not.toThrowError();
            expect(controller.rotationRateText.id).toBe("rotationRate");
        });
        it("rotationRateText - negative test", () => {
            document.body.innerHTML = "";
            expect(() => controller.rotationRateText).toThrowError("Element rotationRate, type p couldn't be found");
        });
        it("frameTable - positive test", () => {
            expect(() => controller.frameTable.get()).not.toThrowError();
            expect(controller.frameTable.get().id).toBe("frameTable");
        });
        it("frameTable - negative test", () => {
            document.body.innerHTML = "";
            expect(() => controller.frameTable.get()).toThrowError("Element frameTable, type table couldn't be found");
        });
        it("addFrameButton - positive test", () => {
            expect(() => controller.addFrameButton.get()).not.toThrowError();
            expect(controller.addFrameButton.get().id).toBe("addFrameButton");
        });
        it("addFrameButton - negative test", () => {
            document.body.innerHTML = "";
            expect(() => controller.addFrameButton.get()).toThrowError(
                "Element addFrameButton, type button couldn't be found",
            );
        });
        it("saveConfigButton - positive test", () => {
            expect(() => controller.saveConfigButton.get()).not.toThrowError();
            expect(controller.saveConfigButton.get().id).toBe("saveConfigButton");
        });
        it("saveConfigButton - negative test", () => {
            document.body.innerHTML = "";
            expect(() => controller.saveConfigButton.get()).toThrowError(
                "Element saveConfigButton, type button couldn't be found",
            );
        });
        it("discardConfigButton - positive test", () => {
            expect(() => controller.discardConfigButton.get()).not.toThrowError();
            expect(controller.discardConfigButton.get().id).toBe("discardConfigButton");
        });
        it("discardConfigButton - negative test", () => {
            document.body.innerHTML = "";
            expect(() => controller.discardConfigButton.get()).toThrowError(
                "Element discardConfigButton, type button couldn't be found",
            );
        });
    });
    describe("addListener", () => {
        beforeEach(() => {
            controller = new TestController(configModel);
        });
        it("Opening the settings modal causes refreshRate to be updated", () => {
            controller.addListenerOriginal();
            document.getElementById("settings")?.dispatchEvent(new Event("show.bs.modal"));
            const refreshRateSlider = document.getElementById("refreshRateSlider");
            expect(refreshRateSlider).not.toBe(null);
            expect((refreshRateSlider as HTMLInputElement).value).toBe("600");
            const refreshRateText = document.getElementById("refreshRate");
            expect(refreshRateText).not.toBe(null);
            expect((refreshRateText as HTMLParagraphElement).innerText).toBe("600");
        });
        it("refreshRate slider load event triggers UI update", async () => {
            controller.addListenerOriginal();
            const refreshRateSlider = document.getElementById("refreshRateSlider");
            expect(refreshRateSlider).not.toBe(null);
            (refreshRateSlider as HTMLInputElement).value = "100";
            refreshRateSlider?.dispatchEvent(new Event("load"));
            await controller.loading;
            const refreshRateText = document.getElementById("refreshRate");
            expect(refreshRateText).not.toBe(null);
            expect((refreshRateText as HTMLParagraphElement).innerText).toBe("100");
        });
        it("refreshRate slider input event triggers UI update", async () => {
            controller.addListenerOriginal();
            const refreshRateSlider = document.getElementById("refreshRateSlider");
            expect(refreshRateSlider).not.toBe(null);
            (refreshRateSlider as HTMLInputElement).value = "100";
            refreshRateSlider?.dispatchEvent(new Event("input"));
            await controller.loading;
            const refreshRateText = document.getElementById("refreshRate");
            expect(refreshRateText).not.toBe(null);
            expect((refreshRateText as HTMLParagraphElement).innerText).toBe("100");
        });
        it("Opening the settings modal causes rotationRate to be updated", () => {
            controller.addListenerOriginal();
            document.getElementById("settings")?.dispatchEvent(new Event("show.bs.modal"));
            const rotationRateSlider = document.getElementById("rotationRateSlider");
            expect(rotationRateSlider).not.toBe(null);
            expect((rotationRateSlider as HTMLInputElement).value).toBe("60");
            const rotationRateText = document.getElementById("rotationRate");
            expect(rotationRateText).not.toBe(null);
            expect((rotationRateText as HTMLParagraphElement).innerText).toBe("60");
        });
        it("rotationRate slider load event triggers UI update", async () => {
            controller.addListenerOriginal();
            const rotationRateSlider = document.getElementById("rotationRateSlider");
            expect(rotationRateSlider).not.toBe(null);
            (rotationRateSlider as HTMLInputElement).value = "20";
            rotationRateSlider?.dispatchEvent(new Event("load"));
            await controller.loading;
            const rotationRateText = document.getElementById("rotationRate");
            expect(rotationRateText).not.toBe(null);
            expect((rotationRateText as HTMLParagraphElement).innerText).toBe("20");
        });
        it("rotationRate slider input event triggers UI update", async () => {
            controller.addListenerOriginal();
            const rotationRateSlider = document.getElementById("rotationRateSlider");
            expect(rotationRateSlider).not.toBe(null);
            (rotationRateSlider as HTMLInputElement).value = "20";
            rotationRateSlider?.dispatchEvent(new Event("input"));
            await controller.loading;
            const rotationRateText = document.getElementById("rotationRate");
            expect(rotationRateText).not.toBe(null);
            expect((rotationRateText as HTMLParagraphElement).innerText).toBe("20");
        });
        it("Clicking on the addFrameButton adds a new item in the frame maintenance table", () => {
            controller.addListenerOriginal();
            expect(controller.frameTable.get().tBodies[0].children.length).toBe(2);
            const button = controller.typedElement("addFrameButton", "button").get();
            button.click();
            expect(controller.frameTable.get().tBodies[0].children.length).toBe(3);
            expect(controller.element("frame2-url").get().innerHTML).toBe("");
        });
        it("Clicking on the addFrameButton adds a new frame into the unsaved config, but not the saved config", () => {
            controller.addListenerOriginal();
            expect(controller.configObject.sites.length).toBe(2);
            expect(controller.unsavedConfigObject.sites.length).toBe(2);
            const button = controller.typedElement("addFrameButton", "button").get();
            button.click();
            expect(controller.configObject.sites.length).toBe(2);
            expect(controller.unsavedConfigObject.sites.length).toBe(3);
        });
        it("Clicking on the discardConfigButton resets the unsaved config", () => {
            controller.addListenerOriginal();
            controller.unsavedConfigObject = {
                sites: [
                    { url: "./frames/clock.html", rotationRate: 60 },
                    { url: "./frames/weather.html", rotationRate: 60 },
                ],
                useGlobalRotationRate: true,
                rotationRate: 70,
                refreshRate: 700,
                wakeLock: false,
            };
            const button = controller.typedElement("discardConfigButton", "button").get();
            button.click();
            expect(controller.unsavedConfigObject.rotationRate).toBe(60);
            expect(controller.configObject.rotationRate).toBe(60);
        });
        it("Clicking on the saveConfigButton synchronizes the saved with the unsaved config", () => {
            controller.addListenerOriginal();
            controller.unsavedConfigObject = {
                sites: [
                    { url: "./frames/clock.html", rotationRate: 60 },
                    { url: "./frames/weather.html", rotationRate: 60 },
                ],
                useGlobalRotationRate: true,
                rotationRate: 70,
                refreshRate: 700,
                wakeLock: false,
            };
            const button = controller.typedElement("saveConfigButton", "button").get();
            button.click();
            expect(controller.unsavedConfigObject.rotationRate).toBe(70);
            expect(controller.configObject.rotationRate).toBe(70);
        });
        it("Unchecking the useGlobalRotationRateCheckBox hides the global Slider and unhides the relevant column", () => {
            controller.addListenerOriginal();
            expect(controller.element("rotationRateDiv").get().hidden).toBe(false);
            expect(controller.element("frameRotationRateHeader").get().hidden).toBe(true);
            const checkbox = controller.typedElement("useGlobalRotationRateCheckBox", "input").get();
            checkbox.click();
            expect(controller.element("rotationRateDiv").get().hidden).toBe(true);
            expect(controller.element("frameRotationRateHeader").get().hidden).toBe(false);
        });
        it("Checking the useGlobalRotationRateCheckBox resets all frame-specific rotation rates to the global value", () => {
            controller.addListenerOriginal();
            expect(controller.unsavedConfigObject.sites[0].rotationRate).toBe(70);
            const checkbox = controller.typedElement("useGlobalRotationRateCheckBox", "input").get();
            checkbox.click();
            controller.unsavedConfigObject = {
                sites: [
                    { url: "./frames/clock.html", rotationRate: 5 },
                    { url: "./frames/weather.html", rotationRate: 10 },
                ],
                useGlobalRotationRate: true,
                rotationRate: 60,
                refreshRate: 600,
                wakeLock: false,
            };
            checkbox.click();
            expect(controller.unsavedConfigObject.sites[0].rotationRate).toBe(60);
        });
        it("Frame-specific RotationRate Cell change event changes the configuration accordingly", async () => {
            controller.addListenerOriginal();
            const rotationRateInput = document.getElementById("frame0-rotationRate");
            expect(controller.unsavedConfigObject.sites[0].rotationRate).toBe(70);
            (rotationRateInput as HTMLInputElement).innerHTML = "20";
            rotationRateInput?.dispatchEvent(new Event("input"));
            await controller.loading;
            expect(controller.unsavedConfigObject.sites[0].rotationRate).toBe(20);
        });
        it("Frame-specific RotationRate Cell won't change anyhting in case textContent is null", async () => {
            controller.addListenerOriginal();
            const rotationRateInput = document.getElementById("frame0-rotationRate");
            expect(controller.unsavedConfigObject.sites[0].rotationRate).toBe(70);
            (rotationRateInput as HTMLInputElement).textContent = null;
            rotationRateInput?.dispatchEvent(new Event("input"));
            await controller.loading;
            expect(controller.unsavedConfigObject.sites[0].rotationRate).toBe(70);
        });
        it("Clicking import Config button just triggers the hidden import config input", () => {
            const spy = jest.fn();
            controller.addListenerOriginal();
            controller.importConfigInput.get().addEventListener("click", spy);
            expect(spy).toHaveBeenCalledTimes(0);
            controller.importConfigButton.get().click();
            expect(spy).toHaveBeenCalledTimes(1);
        });
        it("importConfigInput: Applies settings when triggered with compatible file", async () => {
            controller.addListenerOriginal();
            jest.spyOn(controller.importConfigInput.get(), "files", "get").mockReturnValue({
                0: {
                    text: async () => {
                        return Promise.resolve(
                            '{"sites":[{"url":"./frames/clock.html","rotationRate":75},{"url":"./frames/weather.html","rotationRate":75}],"useGlobalRotationRate":true,"rotationRate":75,"refreshRate":600,"wakeLock":false}',
                        );
                    },
                } as unknown as File,
                length: 1,
                item: (index: number) => {
                    throw new Error(index.toString());
                },
            } as unknown as FileList);
            controller.importConfigInput.get().dispatchEvent(new Event("change"));
            await controller.loading;
            const successElement = document.getElementById("import-success");
            expect(successElement?.hidden).toBe(false);
        });
        it("importConfigInput: Fails in case of incompatible settings file content", async () => {
            controller.addListenerOriginal();
            jest.spyOn(controller.importConfigInput.get(), "files", "get").mockReturnValue({
                0: {
                    text: async () => {
                        return Promise.resolve('{"property": "value"}');
                    },
                } as unknown as File,
                length: 1,
                item: (index: number) => {
                    throw new Error(index.toString());
                },
            } as unknown as FileList);
            controller.importConfigInput.get().dispatchEvent(new Event("change"));
            await controller.loading;
            const errorElement = document.getElementById("import-error");
            expect(errorElement?.hidden).toBe(false);
        });
        it("importConfigInput: Importing without having provided a file will fail", () => {
            controller.addListenerOriginal();
            controller.importConfigInput.get().dispatchEvent(new Event("change"));
            const errorElement = document.getElementById("import-error");
            expect(errorElement?.hidden).toBe(false);
        });
        it("wakeLockCheckBox: toggles wakeLock property in unsaved configuration", () => {
            // @ts-expect-error To mock the wakelock object, this is necessary
            navigator.wakeLock = "someObject";
            controller.addListenerOriginal();
            expect(controller.unsavedConfigObject.wakeLock).toBe(false);
            controller.wakeLockCheckBox.get().dispatchEvent(new Event("click"));
            expect(controller.unsavedConfigObject.wakeLock).toBe(true);
        });
        it("wakeLockCheckBox: If wake lock API is not available, unchecks and disables the checkbox", () => {
            // @ts-expect-error To mock the wakelock object, this is necessary
            navigator.wakeLock = undefined;
            controller.addListenerOriginal();
            expect(controller.unsavedConfigObject.wakeLock).toBe(false);
            controller.wakeLockCheckBox.get().dispatchEvent(new Event("click"));
            const checkbox = controller.wakeLockCheckBox.get();
            expect(controller.unsavedConfigObject.wakeLock).toBe(false);
            expect(checkbox.checked).toBe(false);
            expect(checkbox.disabled).toBe(true);
        });
    });
    describe("getTableColumnIndex", () => {
        it("Returns index of existing column", () => {
            const res = controller.getTableColumnIndex("frameRotationRateHeader");
            expect(res).toBe(1);
        });
        it("Throws error if given column id doesn't exist", () => {
            expect(() => controller.getTableColumnIndex("NotExisting")).toThrowError(
                "Element NotExisting, type th couldn't be found",
            );
        });
        it("Throws error if column parent can't be found", () => {
            controller.typedElement = jest.fn().mockImplementation(() => {
                return {
                    get: (): HTMLTableCellElement => document.createElement("th"),
                };
            });
            expect(() => controller.getTableColumnIndex("frameUrlHeader")).toThrowError(
                "No parent found for header cell frameUrlHeader",
            );
        });
    });
});
