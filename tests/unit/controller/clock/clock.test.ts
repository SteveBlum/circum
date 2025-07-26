/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ClockController, ClockConfig } from "../../../../src/controller/frames/clock/Clock";

describe("Clock Frame Controller", () => {
    class TestController extends ClockController {
        public getRgbaString = super.getRgbaString.bind(this);
        public darkenColor = super.darkenColor.bind(this);
        public renderTime = super.renderTime.bind(this);
        public screenResize = super.screenResize.bind(this);
        get configObject(): ClockConfig {
            return this.config;
        }
        get intervalTest(): NodeJS.Timer | undefined {
            return this.interval;
        }
        set intervalTest(interval: NodeJS.Timer | undefined) {
            this.interval = interval;
        }
    }
    let controller: TestController;
    const config: ClockConfig = {
        locale: "de-DE",
        color: { r: 30, g: 150, b: 0, a: 1 },
    };
    beforeEach(() => {
        document.body.innerHTML = "";
        controller = new TestController(config);
    });
    describe("constructor", () => {
        it("Default config is used if no argument is given", async () => {
            const clockController = new ClockController();
            const res = await clockController.getData();
            expect(res).toStrictEqual(config);
        });
    });
    describe("getRgbaString", () => {
        it("Constructs valid Rgba string", () => {
            const res = controller.getRgbaString(config.color);
            expect(res).toBe("rgba(30, 150, 0, 1)");
        });
    });
    describe("darkenColor", () => {
        it("Generates a rgba color which 2/3 darker than the original", () => {
            const res = controller.darkenColor({ r: 30, g: 60, b: 90, a: 1 });
            expect(res).toStrictEqual({ r: 10, g: 20, b: 30, a: 1 });
        });
        it("Color channels with zero values are kept at zero", () => {
            const res = controller.darkenColor({ r: 0, g: 60, b: 90, a: 1 });
            expect(res).toStrictEqual({ r: 0, g: 20, b: 30, a: 1 });
        });
        it("Uneven numbers are rounded down", () => {
            const res = controller.darkenColor({ r: 4, g: 2, b: 151, a: 1 });
            expect(res).toStrictEqual({ r: 1, g: 0, b: 50, a: 1 });
        });
    });
    describe("colorDark", () => {
        it("Returns the configured color in its darkened variant", () => {
            const res = controller.colorDark;
            expect(res).toStrictEqual({ r: 10, g: 50, b: 0, a: 1 });
        });
    });
    describe("canvas", () => {
        it("Returns the Canvas HTML element", () => {
            document.body.innerHTML = '<canvas id="canvas">cccc</canvas>';
            const res = controller.canvas;
            expect(res.id).toBe("canvas");
        });
        it("Throws error in case that no such canvas exists", () => {
            document.body.innerHTML = "";
            expect(() => controller.canvas).toThrow("Element canvas, type canvas couldn't be found");
        });
    });
    describe("canvasContext", () => {
        it("Returns the Canvas 2d context", () => {
            document.body.innerHTML = '<canvas id="canvas">cccc</canvas>';
            const res = controller.canvasContext;
            expect(res).toHaveProperty("beginPath");
        });
        it("Throws error in case that 2d canvas context cannot be found", () => {
            document.body.innerHTML = '<canvas id="canvas">cccc</canvas>';
            controller.canvas.getContext = jest.fn().mockImplementation(() => {
                return null;
            });
            expect(() => controller.canvasContext).toThrow("Didn't find 2D context for canvas canvas");
        });
    });
    describe("getData", () => {
        it("Returns provided configuration", async () => {
            const res = await controller.getData();
            expect(res).toStrictEqual(config);
        });
    });
    describe("refresh", () => {
        it("Keeps provided configuration", async () => {
            await controller.refresh();
            const res = await controller.getData();
            expect(res).toStrictEqual(config);
        });
    });
    describe("renderTime", () => {
        class NewController extends TestController {
            public screenResize = jest.fn();
        }
        beforeEach(() => {
            document.body.innerHTML = '<canvas id="canvas">cccc</canvas>';
        });
        it("Runs without exception", () => {
            controller = new TestController(config);
            expect(controller.renderTime).not.toThrow();
        });
        it("Runs without exception if canvas height > canvas width", () => {
            controller = new NewController(config);
            controller.canvas.height = 1000;
            controller.canvas.width = 900;
            expect(controller.renderTime).not.toThrow();
            expect(controller.canvas.height > controller.canvas.width).toBe(true);
        });
        it("Runs without exception if canvas width > canvas height", () => {
            controller = new NewController(config);
            controller.canvas.height = 900;
            controller.canvas.width = 1000;
            expect(controller.renderTime).not.toThrow();
            expect(controller.canvas.width > controller.canvas.height).toBe(true);
        });
    });
    describe("screenResize", () => {
        beforeEach(() => {
            document.body.innerHTML = '<canvas id="canvas">cccc</canvas>';
            controller = new TestController(config);
        });
        it("Updates screen size in case width mismatches", () => {
            controller.canvas.width = controller.canvas.clientWidth + 1;
            controller.canvas.height = controller.canvas.clientHeight;
            controller.screenResize();
            expect(controller.canvas.width).toBe(controller.canvas.clientWidth);
        });
        it("Updates screen size in case height mismatches", () => {
            controller.canvas.height = controller.canvas.clientHeight + 1;
            controller.canvas.width = controller.canvas.clientWidth;
            controller.screenResize();
            expect(controller.canvas.height).toBe(controller.canvas.clientHeight);
        });
    });
    describe("refreshView", () => {
        beforeEach(() => {
            document.body.innerHTML = '<canvas id="canvas">cccc</canvas>';
            controller = new TestController(config);
        });
        it("Starts interval", () => {
            controller.intervalTest = undefined;
            controller.refreshView(config);
            expect(controller.intervalTest).not.toBeUndefined();
        });
        it("Updates configuration", () => {
            const newConfig = config;
            newConfig.locale = "en-EN";
            controller.refreshView(newConfig);
            expect(controller.configObject).toStrictEqual(newConfig);
        });
        it("Throws error if provided with one", () => {
            expect(() => {
                controller.refreshView(new Error("Test"));
            }).toThrow("Test");
        });
    });
});
