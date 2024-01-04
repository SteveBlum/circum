/* eslint-disable @typescript-eslint/no-unsafe-call */
import { MainController } from "../../../src/controller/Main";
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

describe("Main Controller", () => {
    class TestController extends MainController {
        public fullScreenTriggered = false;
        public addListener(): void {
            return;
        }
        public addListenerOriginal(): void {
            super.addListener();
        }
        public toggleFullScreen(): Promise<void> {
            this.fullScreenTriggered = true;
            return Promise.resolve();
        }
    }
    let controller: TestController;
    let configModel: ConfigModel;
    beforeEach(() => {
        configModel = new ConfigModel();
        document.body.innerHTML =
            '<div id="myCarouselInner" class="carousel-inner"></div>' +
            '<a id="fullscreenButton" class="dropdown-item" href="#"></a>' +
            '<li><a id="refreshNowButton" class="dropdown-item refreshOption" href="#" refreshRate=0>Now</a></li>' +
            '<li><a id="refresh1Button" class="dropdown-item refreshOption" href="#" refreshRate=60>1 min</a></li>' +
            '<li><a id="refresh5Button" class="dropdown-item refreshOption" href="#" refreshRate=300>5 min</a></li>' +
            '<li><a id="brokenRefreshButton" class="dropdown-item refreshOption" href="#">No min</a></li>';
    });
    describe("constructor", () => {
        it("Default config is used if no argument is given", () => {
            const mainController = new MainController(configModel);
            const res = mainController.config;
            expect(res).toStrictEqual(config);
        });
        it("Triggers refresh action", () => {
            const mockRefresh = jest.fn();
            class ConfigTestController extends TestController {
                public async refresh(): Promise<void> {
                    await mockRefresh();
                }
            }
            controller = new ConfigTestController(configModel);
            expect(mockRefresh).toHaveBeenCalledTimes(1);
        });
    });
    describe("refresh", () => {
        it("Keeps provided configuration", async () => {
            controller = new TestController(configModel);
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
            expect(controller.config).toStrictEqual(controller.config);
        });
        it("Adjusts frames in case frame config was changed", () => {
            const newConfig = {
                sites: [{ url: "./frames/clock.html", rotationRate: 60 }],
                useGlobalRotationRate: true,
                rotationRate: 61,
                refreshRate: 600,
                wakeLock: false,
            };
            expect(controller.frames().count()).toBe(2);
            controller.refreshView(newConfig);
            expect(controller.frames().count()).toBe(1);
        });
        it("Adds frames in case no frames were added yet", () => {
            expect(controller.frames().count()).toBe(2);
            controller.frames().remove();
            expect(controller.frames().count()).toBe(0);
            controller.refreshView(config);
            expect(controller.frames().count()).toBe(2);
        });
        it("Throws error if provided with one", () => {
            expect(() => {
                controller.refreshView(new Error("Test"));
            }).toThrowError("Test");
        });
        it("Activates wake lock if configured", () => {
            const newConfig = {
                sites: [{ url: "./frames/clock.html", rotationRate: 60 }],
                useGlobalRotationRate: true,
                rotationRate: 60,
                refreshRate: 600,
                wakeLock: true,
            };
            const mockWakeLockOn = jest.fn();
            const mockWakeLockOff = jest.fn();
            jest.spyOn(controller, "wakeLock", "get").mockImplementation(() => {
                return {
                    on: mockWakeLockOn,
                    off: mockWakeLockOff,
                    check: jest.fn(),
                    compatible: jest.fn(),
                };
            });
            controller.refreshView(newConfig);
            expect(mockWakeLockOn).toHaveBeenCalledTimes(1);
            expect(mockWakeLockOff).toHaveBeenCalledTimes(0);
        });
        it("Specifically de-activated wake lock if configured", () => {
            const newConfig = {
                sites: [{ url: "./frames/clock.html", rotationRate: 60 }],
                useGlobalRotationRate: true,
                rotationRate: 60,
                refreshRate: 600,
                wakeLock: false,
            };
            const mockWakeLockOn = jest.fn();
            const mockWakeLockOff = jest.fn();
            jest.spyOn(controller, "wakeLock", "get").mockImplementation(() => {
                return {
                    on: mockWakeLockOn,
                    off: mockWakeLockOff,
                    check: jest.fn(),
                    compatible: jest.fn(),
                };
            });
            controller.refreshView(newConfig);
            expect(mockWakeLockOn).toHaveBeenCalledTimes(0);
            expect(mockWakeLockOff).toHaveBeenCalledTimes(1);
        });
    });
    describe("addListener", () => {
        beforeEach(() => {
            controller = new TestController(configModel);
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
            controller.addListenerOriginal();
        });
        it("Clicking fullscreen button triggers fullscreen function", () => {
            document.getElementById("fullscreenButton")?.click();
            expect(controller.fullScreenTriggered).toBe(true);
        });
        it("Clicking any refreshOption Updates the refreshRate", () => {
            document.getElementById("refresh1Button")?.click();
            expect(controller.config.refreshRate).toBe(60);
            document.getElementById("refresh5Button")?.click();
            expect(controller.config.refreshRate).toBe(300);
        });
        it("Clicking a refreshOption without given refreshRate attribute does nothing", () => {
            document.getElementById("brokenRefreshButton")?.click();
            expect(controller.config.refreshRate).toBe(600);
        });
        it("Clicking a refreshOption with a refreshRate of 0 refreshes instantly without changing the config", () => {
            document.getElementById("refreshNowButton")?.click();
            expect(controller.config.refreshRate).toBe(600);
        });
    });
    describe("config setter", () => {
        it("Updates configuration object", () => {
            const newConfig = {
                sites: [
                    { url: "./frames/clock.html", rotationRate: 60 },
                    { url: "./frames/weather.html", rotationRate: 60 },
                ],
                useGlobalRotationRate: true,
                rotationRate: 70,
                refreshRate: 610,
                wakeLock: false,
            };
            controller = new TestController(configModel);
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
            controller.config = newConfig;
            expect(controller.config).toStrictEqual(newConfig);
        });
        it("Triggers refresh action", () => {
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
    describe("frame", () => {
        beforeEach(() => {
            controller = new TestController(configModel);
        });
        it("get - Returns matching iframe", () => {
            const res = controller.frame("0Frame").get();
            expect(res.id).toBe("0Frame");
        });
        it("get - Fails if no such iframe exists", () => {
            expect(controller.frame("nonExistentFrame").get).toThrowError(
                "Element nonExistentFrame, type iframe couldn't be found",
            );
        });
        // The refresh doesn't do anything noticable to this environment
        it("refresh - doesn't fail", () => {
            controller.frame("0Frame").refresh();
            expect(true).toBe(true);
        });
        it("remove - Removes a given frame", () => {
            expect(controller.frames().count()).toBe(2);
            controller.frame("0Frame").remove();
            expect(controller.frames().count()).toBe(1);
        });
        it("remove - Also removes given frame parent div", () => {
            expect(document.getElementById("0FrameDiv")).not.toBe(null);
            controller.frame("0Frame").remove();
            expect(document.getElementById("0FrameDiv")).toBe(null);
        });
        it("remove - Throws error when trying to remove a non-existent frame", () => {
            expect(controller.frame("nonExistentFrame").remove).toThrowError(
                "Element nonExistentFrame, type iframe couldn't be found",
            );
        });
    });
    describe("frames", () => {
        beforeEach(() => {
            controller = new TestController(configModel);
        });
        it("get - Returns all iframes", () => {
            const res = controller.frames().get();
            expect(res.length).toBe(2);
        });
        // The refresh doesn't do anything noticable to this environment
        it("refresh - doesn't fail", () => {
            controller.frames().refresh();
            expect(true).toBe(true);
        });
        it("remove - Removes all frames", () => {
            expect(controller.frames().count()).toBe(2);
            controller.frames().remove();
            expect(controller.frames().count()).toBe(0);
        });
        it("remove - Removes all frame parents divs", () => {
            expect(controller.carouselInner.get().children.length).toBe(2);
            controller.frames().remove();
            expect(controller.carouselInner.get().children.length).toBe(0);
        });
        it("count - Returns number of frames", () => {
            expect(controller.frames().count()).toBe(2);
        });
        it("add - Adds a single frame to the page", () => {
            expect(controller.frames().count()).toBe(2);
            controller.frames().add({ url: "someURL", rotationRate: 60 });
            expect(controller.frames().count()).toBe(3);
            const frame = document.getElementById("2Frame");
            expect(frame?.getAttribute("class")).toBe("vh-100");
        });
    });
});
