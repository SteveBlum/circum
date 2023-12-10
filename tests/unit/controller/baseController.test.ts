/* eslint-disable @typescript-eslint/no-unsafe-call */
import { BaseController } from "../../../src/controller/baseController";

describe("Base Controller", () => {
    jest.useFakeTimers();
    const mockRefresh: () => Promise<void> = jest.fn();
    let controller: TestController;
    class TestController extends BaseController<boolean> {
        public refresh = mockRefresh;
        protected refreshView = jest.fn();
        get ipInfo(): Promise<Response> {
            return new Promise((resolve) => {
                resolve({
                    json: () => {
                        return {
                            ip: "1.1.1.1",
                            hostname: "something.host.com",
                            city: "someCity",
                            region: "someState",
                            country: "DE",
                            loc: "51.2,45.3",
                            org: "SomeCompany",
                            postal: "123456",
                            timezone: "Europe/Berlin",
                            readme: "https://ipinfo.io/missingauth",
                        };
                    },
                } as unknown as Response);
            });
        }
    }
    beforeEach(() => {
        const mockGeolocation: Geolocation = {
            getCurrentPosition: jest.fn().mockImplementation((success) => {
                success({
                    timestamp: 1,
                    coords: {
                        latitude: 51.1,
                        longitude: 45.4,
                        accuracy: 1,
                        altitude: 1,
                        altitudeAccuracy: 1,
                        heading: 1,
                        speed: 1,
                    },
                });
            }),
            watchPosition: jest.fn(),
            clearWatch: jest.fn(),
        };
        // @ts-expect-error because
        navigator.geolocation = mockGeolocation;
        controller = new TestController();
    });
    describe("getPosition", () => {
        it("Returns position (mocked)", async () => {
            const res = await controller.getPosition();
            expect(res).toHaveProperty("coords");
            expect(res.coords.latitude).toBe(51.1);
        });
        it("In case geolocation request failed, returns position based on IP", async () => {
            // First making sure that the Geolocation request will actually fail
            const mockGeolocationFailing: Geolocation = {
                getCurrentPosition: jest.fn().mockImplementation((success, err) => {
                    err(new Error("Something didn't work"));
                }),
                watchPosition: jest.fn(),
                clearWatch: jest.fn(),
            };
            // @ts-expect-error because
            navigator.geolocation = mockGeolocationFailing;
            const res = await controller.getPosition();
            expect(res).toHaveProperty("coords");
            expect(res.coords.latitude).toBe(51.2);
        });
        it("In case both geolocation and IP-based location request failed, throws error", async () => {
            // First making sure that the Geolocation request will actually fail
            const mockGeolocationFailing: Geolocation = {
                getCurrentPosition: jest.fn().mockImplementation((success, err) => {
                    err(new Error("Something didn't work"));
                }),
                watchPosition: jest.fn(),
                clearWatch: jest.fn(),
            };
            // @ts-expect-error because
            navigator.geolocation = mockGeolocationFailing;
            class TestController2 extends TestController {
                get ipInfo(): Promise<Response> {
                    return new Promise((resolve, reject) => {
                        reject(new Error("Test"));
                    });
                }
            }
            controller = new TestController2();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            await expect(controller.getPosition()).rejects.toThrow("Test");
        });
        it("In case geolocation fails and IP-based location request responds with incorrect data structure, throws error", async () => {
            // First making sure that the Geolocation request will actually fail
            const mockGeolocationFailing: Geolocation = {
                getCurrentPosition: jest.fn().mockImplementation((success, err) => {
                    err(new Error("Something didn't work"));
                }),
                watchPosition: jest.fn(),
                clearWatch: jest.fn(),
            };
            // @ts-expect-error because
            navigator.geolocation = mockGeolocationFailing;
            class TestController2 extends TestController {
                get ipInfo(): Promise<Response> {
                    return new Promise((resolve) => {
                        resolve({
                            json: () => {
                                return {
                                    a: 1,
                                };
                            },
                        } as unknown as Response);
                    });
                }
            }
            controller = new TestController2();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            await expect(controller.getPosition()).rejects.toThrow("Couldn't parse IP Info response");
        });
        it("IP-based location request is only done once, the result is the re-used", async () => {
            // First making sure that the Geolocation request will actually fail
            const mockGeolocationFailing: Geolocation = {
                getCurrentPosition: jest.fn().mockImplementation((success, err) => {
                    err(new Error("Something didn't work"));
                }),
                watchPosition: jest.fn(),
                clearWatch: jest.fn(),
            };
            // @ts-expect-error because
            navigator.geolocation = mockGeolocationFailing;
            Object.defineProperty(controller, "ipInfo", {
                get: jest
                    .fn()
                    .mockImplementationOnce(() => {
                        return new Promise((resolve) => {
                            resolve({
                                json: () => {
                                    return {
                                        ip: "1.1.1.1",
                                        hostname: "something.host.com",
                                        city: "someCity",
                                        region: "someState",
                                        country: "DE",
                                        loc: "51.2,45.3",
                                        org: "SomeCompany",
                                        postal: "123456",
                                        timezone: "Europe/Berlin",
                                        readme: "https://ipinfo.io/missingauth",
                                    };
                                },
                            } as unknown as Response);
                        });
                    })
                    .mockImplementationOnce(() => {
                        return new Promise((resolve, reject) => {
                            reject(new Error("Test"));
                        });
                    }),
            });
            await controller.getPosition();
            const res = await controller.getPosition();
            expect(res).toHaveProperty("coords");
            expect(res.coords.latitude).toBe(51.2);
        });
    });
    describe("element", () => {
        beforeEach(() => {
            document.body.innerHTML =
                '<h1 id="temperature" class="large-font mr-3 green-font">26</h1>' +
                '<div class="d-flex flex-column mr-3">' +
                '<h2 id="location" class="mt-3 mb-0 green-font">--</h2>' +
                '<small id="lastUpdated" class="green-font">--</small>' +
                '<div id="stateExample"><p id="state-Normal" /><p id="state-Normal-hidden" hidden="true" /><p id="not-a-state" /><p id="state-Success" hidden="true" /><p id="state-Success2" hidden="true" /><p id="state-sUcCeSs" hidden="true" /><p id="state-Error" hidden="true" /><p id="state-Loading" hidden="true" /></div>' +
                "</div>";
        });
        it("get - Returns existing HTML element", () => {
            const res = controller.element("temperature").get();
            expect(res.innerHTML).toBe("26");
        });
        it("get - Throws exception if ID doesn't exist", () => {
            expect(() => {
                controller.element("notExisting").get();
            }).toThrowError("Element notExisting couldn't be found");
        });
        it("addListener - adds a single event listener function", () => {
            const mockListener = jest.fn();
            controller.element("temperature").addListener("click", mockListener);
            document.getElementById("temperature")?.click();
            expect(mockListener).toBeCalledTimes(1);
        });
        it("addListener - adds multiple event listener functions", () => {
            const mockListener1 = jest.fn();
            const mockListener2 = jest.fn();
            controller.element("temperature").addListener("click", [mockListener1, mockListener2]);
            document.getElementById("temperature")?.click();
            expect(mockListener1).toBeCalledTimes(1);
            expect(mockListener2).toBeCalledTimes(1);
        });
        it("remove - removes the element from DOM", () => {
            controller.element("temperature").remove();
            const element = document.getElementById("temperature");
            expect(element).toBe(null);
        });
        it("triggerState - un-hides single child element containing the name of the state", () => {
            controller.element("stateExample").triggerState("Success");
            const element = document.getElementById("state-Success");
            expect(element?.hidden).toBe(false);
        });
        it("triggerState - un-hides multiple child elements containing the name of the state", () => {
            controller.element("stateExample").triggerState("Success");
            const element1 = document.getElementById("state-Success");
            const element2 = document.getElementById("state-Success2");
            expect(element1?.hidden).toBe(false);
            expect(element2?.hidden).toBe(false);
        });
        it("triggerState - ignores capitalization when identifying child-elements", () => {
            controller.element("stateExample").triggerState("Success");
            const element = document.getElementById("state-sUcCeSs");
            expect(element?.hidden).toBe(false);
        });
        it("triggerState - hides child elements which match other states", () => {
            controller.element("stateExample").triggerState("Success");
            const element = document.getElementById("state-Normal");
            expect(element?.hidden).toBe(true);
        });
        it("triggerState - ignores child elements which don't match any state name", () => {
            controller.element("stateExample").triggerState("Success");
            const element = document.getElementById("not-a-state");
            expect(element?.hidden).toBe(false);
        });
        it("triggerState - works for success state", () => {
            controller.element("stateExample").triggerState("Success");
            const element = document.getElementById("state-Success");
            expect(element?.hidden).toBe(false);
        });
        it("triggerState - works for loading state", () => {
            controller.element("stateExample").triggerState("Loading");
            const element = document.getElementById("state-Loading");
            expect(element?.hidden).toBe(false);
        });
        it("triggerState - works for error state", () => {
            controller.element("stateExample").triggerState("Error");
            const element = document.getElementById("state-Error");
            expect(element?.hidden).toBe(false);
        });
        it("triggerState - works for normal state", () => {
            controller.element("stateExample").triggerState("Normal");
            const element = document.getElementById("state-Normal-hidden");
            expect(element?.hidden).toBe(false);
        });
        it("triggerState - optionally will trigger normal state after given time", () => {
            controller.element("stateExample").triggerState("Error", 1000);
            let element = document.getElementById("state-Normal");
            expect(element?.hidden).toBe(true);
            jest.runAllTimers();
            element = document.getElementById("state-Normal");
            expect(element?.hidden).toBe(false);
        });
    });
    describe("elements", () => {
        beforeEach(() => {
            document.body.innerHTML =
                '<h1 id="temperature" class="large-font mr-3 green-font">26</h1>' +
                '<div class="d-flex flex-column mr-3">' +
                '<h2 id="location" class="mt-3 mb-0 green-font">--</h2>' +
                '<small id="lastUpdated" class="green-font">--</small>' +
                "</div>";
        });
        it("get - Returns existing HTML element", () => {
            const res = controller.elements("green-font").get();
            expect(res.length).toBe(3);
        });
        it("get - Returns empty HTML Collection if no element matched", () => {
            const elements = controller.elements("notExisting").get();
            expect(elements.length).toBe(0);
        });
        it("addListener - adds a single event listener function to all matching elements", () => {
            const mockListener = jest.fn();
            controller.elements("green-font").addListener("click", mockListener);
            document.getElementById("temperature")?.click();
            expect(mockListener).toBeCalledTimes(1);
            document.getElementById("location")?.click();
            expect(mockListener).toBeCalledTimes(2);
            document.getElementById("lastUpdated")?.click();
            expect(mockListener).toBeCalledTimes(3);
        });
        it("addListener - adds multiple event listener functions to all matching elements", () => {
            const mockListener1 = jest.fn();
            const mockListener2 = jest.fn();
            controller.elements("green-font").addListener("click", [mockListener1, mockListener2]);
            document.getElementById("temperature")?.click();
            expect(mockListener1).toBeCalledTimes(1);
            expect(mockListener2).toBeCalledTimes(1);
            document.getElementById("location")?.click();
            expect(mockListener1).toBeCalledTimes(2);
            expect(mockListener2).toBeCalledTimes(2);
            document.getElementById("lastUpdated")?.click();
            expect(mockListener1).toBeCalledTimes(3);
            expect(mockListener2).toBeCalledTimes(3);
        });
        it("remove - removes all matching elements from DOM", () => {
            controller.elements("green-font").remove();
            const element1 = document.getElementById("temperature");
            expect(element1).toBe(null);
            const element2 = document.getElementById("location");
            expect(element2).toBe(null);
            const element3 = document.getElementById("lastUpdated");
            expect(element3).toBe(null);
        });
    });
    describe("typedElement", () => {
        beforeAll(() => {
            document.body.innerHTML =
                '<h1 id="temperature" class="large-font mr-3 green-font">26</h1>' +
                '<div class="d-flex flex-column mr-3">' +
                '<h2 id="location" class="mt-3 mb-0 green-font">--</h2>' +
                '<small id="lastUpdated" class="green-font">--</small>' +
                '<div id="stateExample"><p id="state-Normal" /><p id="state-Normal-hidden" hidden="true" /><p id="not-a-state" /><p id="state-Success" hidden="true" /><p id="state-Success2" hidden="true" /><p id="state-sUcCeSs" hidden="true" /><p id="state-Error" hidden="true" /><p id="state-Loading" hidden="true" /></div>' +
                "</div>";
        });
        it("get - Returns existing HTML element", () => {
            const res = controller.element("temperature").get();
            expect(res.innerHTML).toBe("26");
        });
        it("get - Throws exception if ID doesn't exist", () => {
            expect(() => {
                controller.typedElement("notExisting", "h1").get();
            }).toThrowError("Element notExisting, type h1 couldn't be found");
        });
        it("addListener - adds a single event listener function", () => {
            const mockListener = jest.fn();
            controller.typedElement("temperature", "h1").addListener("click", mockListener);
            document.getElementById("temperature")?.click();
            expect(mockListener).toBeCalledTimes(1);
        });
        it("addListener - adds multiple event listener functions", () => {
            const mockListener1 = jest.fn();
            const mockListener2 = jest.fn();
            controller.typedElement("temperature", "h1").addListener("click", [mockListener1, mockListener2]);
            document.getElementById("temperature")?.click();
            expect(mockListener1).toBeCalledTimes(1);
            expect(mockListener2).toBeCalledTimes(1);
        });
        it("remove - removes the element from DOM", () => {
            controller.typedElement("temperature", "h1").remove();
            const element = document.getElementById("temperature");
            expect(element).toBe(null);
        });
        // rest of the triggerState tests can be found in test block "element"
        it("triggerState - un-hides single child element containing the name of the state", () => {
            controller.typedElement("stateExample", "div").triggerState("Success");
            const element = document.getElementById("state-Success");
            expect(element?.hidden).toBe(false);
        });
    });
    describe("typedElements", () => {
        beforeEach(() => {
            document.body.innerHTML =
                '<h1 id="temperature" class="large-font mr-3 green-font">26</h1>' +
                '<div class="d-flex flex-column mr-3">' +
                '<h1 id="location" class="mt-3 mb-0 green-font">--</h1>' +
                '<h1 id="lastUpdated" class="green-font">--</h1>' +
                "</div>";
        });
        it("get - Returns existing HTML element", () => {
            const res = controller.typedElements("h1").get();
            expect(res.length).toBe(3);
        });
        it("get - Returns empty HTML Collection if no element matched", () => {
            const elements = controller.typedElements("a").get();
            expect(elements.length).toBe(0);
        });
        it("addListener - adds a single event listener function to all matching elements", () => {
            const mockListener = jest.fn();
            controller.typedElements("h1").addListener("click", mockListener);
            document.getElementById("temperature")?.click();
            expect(mockListener).toBeCalledTimes(1);
            document.getElementById("location")?.click();
            expect(mockListener).toBeCalledTimes(2);
            document.getElementById("lastUpdated")?.click();
            expect(mockListener).toBeCalledTimes(3);
        });
        it("addListener - adds multiple event listener functions to all matching elements", () => {
            const mockListener1 = jest.fn();
            const mockListener2 = jest.fn();
            controller.typedElements("h1").addListener("click", [mockListener1, mockListener2]);
            document.getElementById("temperature")?.click();
            expect(mockListener1).toBeCalledTimes(1);
            expect(mockListener2).toBeCalledTimes(1);
            document.getElementById("location")?.click();
            expect(mockListener1).toBeCalledTimes(2);
            expect(mockListener2).toBeCalledTimes(2);
            document.getElementById("lastUpdated")?.click();
            expect(mockListener1).toBeCalledTimes(3);
            expect(mockListener2).toBeCalledTimes(3);
        });
        it("remove - removes all matching elements from DOM", () => {
            controller.typedElements("h1").remove();
            const element1 = document.getElementById("temperature");
            expect(element1).toBe(null);
            const element2 = document.getElementById("location");
            expect(element2).toBe(null);
            const element3 = document.getElementById("lastUpdated");
            expect(element3).toBe(null);
        });
    });
});
