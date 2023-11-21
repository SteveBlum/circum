/* eslint-disable @typescript-eslint/no-unsafe-call */
import { WeatherController } from "../../../../src/controller/frames/weather/Weather";
import { V1ForecastGet200Response } from "../../../../src/controller/frames/weather/open-meteo-client";
import { Model } from "../../../../src/models/model";

describe("Weather Frame Controller", () => {
    const mockGeolocationPosition = {
        timestamp: 1,
        coords: {
            latitude: 51.1,
            longitude: 45.3,
            accuracy: 1,
            altitude: 1,
            altitudeAccuracy: 1,
            heading: 1,
            speed: 1,
        },
    };
    const weatherData: V1ForecastGet200Response = {
        latitude: 51.1,
        longitude: 45.3,
        current: {
            temperature2m: 23,
            time: "2023-01-01T01:00",
            weatherCode: 23,
            windDirection10m: 266,
            windSpeed10m: 23,
        },
        hourly: {
            time: ["4030-01-01T02:00", "4030-01-01T03:00"],
            windSpeed10m: [4.3, 10],
            windDirection10m: [123, 154],
            temperature2m: [16, 23],
            weatherCode: [48, 55],
        },
    };
    beforeAll(() => {
        const mockGeolocation: Geolocation = {
            getCurrentPosition: jest.fn().mockImplementation((success) => {
                success({
                    timestamp: 1,
                    coords: {
                        latitude: 51.1,
                        longitude: 45.3,
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
        document.body.innerHTML =
            '<h3 id="weatherIcon" class="bi bi-brightness-high-fill main-weather"></h3>' +
            '<h1 id="temperature" class="large-font mr-3 green-font">--&#176;</h1>' +
            '<h2 id="weatherDescription" class="mr-3 green-font">Unknown weather condition</h2>' +
            '<h2 id="wind" class="mr-3 green-font"></h2>' +
            '<div class="d-flex flex-column mr-3">' +
            '<h2 id="location" class="mt-3 mb-0 green-font">--</h2>' +
            '<small id="lastUpdated" class="green-font">--</small>' +
            "</div>" +
            '<div id="forecastHourlyDiv">';
    });
    describe("getData", () => {
        let controller: WeatherController;
        beforeEach(() => {
            controller = new WeatherController();
        });
        it("Getting current weather works", async () => {
            const res = await controller.getData();
            expect(res).toHaveProperty("current");
        });
    });
    describe("getCoordinates", () => {
        let controller: WeatherController;
        let spy: jest.SpyInstance<Promise<GeolocationPosition>>;
        const mockGeolocationPosition2 = {
            timestamp: 1,
            coords: {
                latitude: 51.1,
                longitude: 45.3,
                accuracy: 2,
                altitude: 2,
                altitudeAccuracy: 2,
                heading: 2,
                speed: 2,
            },
        };
        beforeEach(() => {
            controller = new WeatherController();
            spy = jest
                .spyOn(controller, "getPosition")
                .mockImplementation(() => Promise.resolve(mockGeolocationPosition2));
        });
        it("Get coordinates from position", async () => {
            const res = await controller.getCoordinates(true);
            expect(res).toStrictEqual(mockGeolocationPosition2.coords);
            expect(spy).toBeCalledTimes(1);
        });
        it("Reuses old position if not told otherwise", async () => {
            const res = await controller.getCoordinates();
            expect(res).toStrictEqual(mockGeolocationPosition.coords);
            expect(spy).toBeCalledTimes(0);
        });
    });
    describe("refreshSync", () => {
        const mockRefresh = jest.fn().mockImplementation(() => Promise.resolve());
        class TestController extends WeatherController {
            public refresh = mockRefresh;
            public syncRefresh(): void {
                super.syncRefresh();
            }
        }
        let controller: TestController;
        beforeEach(() => {
            controller = new TestController();
        });
        it("Triggers refresh", () => {
            expect(mockRefresh).toBeCalledTimes(0);
            controller.syncRefresh();
            expect(mockRefresh).toBeCalledTimes(1);
        });
    });
    describe("refresh", () => {
        const mockGetData = jest.fn().mockImplementation(() => Promise.resolve(weatherData));
        class TestController extends WeatherController {
            constructor() {
                super();
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                this._model = new Model(this.getData.bind(this), this.refreshView.bind(this));
            }
            public getData = mockGetData;
        }
        let controller: TestController;
        it("Uses model to request new data", async () => {
            expect(mockGetData).toBeCalledTimes(0);
            controller = new TestController();
            // Triggered by constructor
            expect(mockGetData).toBeCalledTimes(1);
            await controller.refresh();
            expect(mockGetData).toBeCalledTimes(2);
            const res = await controller.model.data;
            expect((res as V1ForecastGet200Response).current?.temperature2m).toBe(23);
        });
    });
    describe("refreshView", () => {
        class TestController extends WeatherController {
            public refreshView(data: V1ForecastGet200Response | Error): void {
                super.refreshView(data);
            }
        }
        let controller: TestController;
        beforeEach(() => {
            controller = new TestController();
            document.body.innerHTML =
                '<h3 id="weatherIcon" class="bi bi-brightness-high-fill main-weather"></h3>' +
                '<h1 id="temperature" class="large-font mr-3 green-font">test</h1>' +
                '<h2 id="weatherDescription" class="mr-3 green-font">Unknown weather condition</h2>' +
                '<h2 id="wind" class="mr-3 green-font"></h2>' +
                '<div class="d-flex flex-column mr-3">' +
                '<h2 id="location" class="mt-3 mb-0 green-font">--</h2>' +
                '<small id="lastUpdated" class="green-font">--</small>' +
                "</div>" +
                '<div id="forecastHourlyDiv">';
        });
        it("Doesn't change HTML in case data contains error", () => {
            controller.refreshView(new Error("Test"));
            expect(controller.temperatureElement.innerHTML).toBe("test");
        });
        it("Adjusts currentWeather data in view", () => {
            controller.refreshView(weatherData);
            expect(controller.temperatureElement.innerHTML).toBe("23°C");
            expect(controller.lastUpdatedElement.innerHTML).toBe("last updated: 1.1.2023 01:00:00");
        });
        it("Adjusts current location data in view", () => {
            controller.refreshView(weatherData);
            expect(controller.locationElement.innerHTML).toBe("51.1, 45.3");
        });
        it("Adjusts hourly data in view", () => {
            controller.refreshView(weatherData);
            expect(controller.element("forecastHourlyTime0").get().innerText).toBe("1.1.4030 02:00:00");
            expect(controller.element("forecastHourlyTemparature0").get().innerText).toBe("16°C");
            expect(controller.element("forecastHourlyWeatherDescription0").get().innerText).toBe("Depositing rime fog");
            expect(controller.element("forecastHourlyTime1").get().innerText).toBe("1.1.4030 03:00:00");
            expect(controller.element("forecastHourlyTemparature1").get().innerText).toBe("23°C");
            expect(controller.element("forecastHourlyWeatherDescription1").get().innerText).toBe("Dense drizzle");
        });
        it("Doesn't duplicate forecast data in case refreshView is triggered multiple times", () => {
            controller.refreshView(weatherData);
            expect(controller.element("forecastHourlyDiv").get().childElementCount).toBe(2);
            controller.refreshView(weatherData);
            expect(controller.element("forecastHourlyDiv").get().childElementCount).toBe(2);
        });
        it("Disregards hourly forecast in case displayed data is missing from the response", () => {
            controller.refreshView({
                latitude: 51.1,
                longitude: 45.3,
                current: {
                    temperature2m: 23,
                    time: "2023-01-01T01:00",
                    weatherCode: 23,
                    windDirection10m: 266,
                    windSpeed10m: 23,
                },
                hourly: {
                    time: ["4030-01-01T02:00", "4030-01-01T03:00"],
                    windSpeed10m: [4.3, 10],
                    windDirection10m: [123, 154],
                    weatherCode: [48, 55],
                },
            });
            expect(() => controller.element("forecastHourlyTime0").get()).toThrowError(
                "Element forecastHourlyTime0 couldn't be found",
            );
        });
        it("Disregards hourly forecast in case weatherCode is invalid or missing", () => {
            controller.refreshView({
                latitude: 51.1,
                longitude: 45.3,
                current: {
                    temperature2m: 23,
                    time: "2023-01-01T01:00",
                    weatherCode: 23,
                    windDirection10m: 266,
                    windSpeed10m: 23,
                },
                hourly: {
                    time: ["4030-01-01T02:00"],
                    windSpeed10m: [4.3],
                    windDirection10m: [123],
                    weatherCode: [100],
                },
            });
            expect(() => controller.element("forecastHourlyTime0").get()).toThrowError(
                "Element forecastHourlyTime0 couldn't be found",
            );
        });
        it("Cardinal directions are determined correctly", () => {
            controller.refreshView({
                latitude: 51.1,
                longitude: 45.3,
                current: {
                    temperature2m: 23,
                    time: "2023-01-01T01:00",
                    weatherCode: 23,
                    windDirection10m: 10,
                    windSpeed10m: 10,
                },
            });
            expect(controller.wind.innerText).toBe("Wind: 10 km/h, direction North");
            controller.refreshView({
                latitude: 51.1,
                longitude: 45.3,
                current: {
                    temperature2m: 23,
                    time: "2023-01-01T01:00",
                    weatherCode: 23,
                    windDirection10m: 350,
                    windSpeed10m: 10,
                },
            });
            expect(controller.wind.innerText).toBe("Wind: 10 km/h, direction North");
            controller.refreshView({
                latitude: 51.1,
                longitude: 45.3,
                current: {
                    temperature2m: 23,
                    time: "2023-01-01T01:00",
                    weatherCode: 23,
                    windDirection10m: 40,
                    windSpeed10m: 10,
                },
            });
            expect(controller.wind.innerText).toBe("Wind: 10 km/h, direction Northeast");
            controller.refreshView({
                latitude: 51.1,
                longitude: 45.3,
                current: {
                    temperature2m: 23,
                    time: "2023-01-01T01:00",
                    weatherCode: 23,
                    windDirection10m: 90,
                    windSpeed10m: 10,
                },
            });
            expect(controller.wind.innerText).toBe("Wind: 10 km/h, direction East");
            controller.refreshView({
                latitude: 51.1,
                longitude: 45.3,
                current: {
                    temperature2m: 23,
                    time: "2023-01-01T01:00",
                    weatherCode: 23,
                    windDirection10m: 130,
                    windSpeed10m: 10,
                },
            });
            expect(controller.wind.innerText).toBe("Wind: 10 km/h, direction Southeast");
            controller.refreshView({
                latitude: 51.1,
                longitude: 45.3,
                current: {
                    temperature2m: 23,
                    time: "2023-01-01T01:00",
                    weatherCode: 23,
                    windDirection10m: 170,
                    windSpeed10m: 10,
                },
            });
            expect(controller.wind.innerText).toBe("Wind: 10 km/h, direction South");
            controller.refreshView({
                latitude: 51.1,
                longitude: 45.3,
                current: {
                    temperature2m: 23,
                    time: "2023-01-01T01:00",
                    weatherCode: 23,
                    windDirection10m: 230,
                    windSpeed10m: 10,
                },
            });
            expect(controller.wind.innerText).toBe("Wind: 10 km/h, direction Southwest");
            controller.refreshView({
                latitude: 51.1,
                longitude: 45.3,
                current: {
                    temperature2m: 23,
                    time: "2023-01-01T01:00",
                    weatherCode: 23,
                    windDirection10m: 290,
                    windSpeed10m: 10,
                },
            });
            expect(controller.wind.innerText).toBe("Wind: 10 km/h, direction West");
            controller.refreshView({
                latitude: 51.1,
                longitude: 45.3,
                current: {
                    temperature2m: 23,
                    time: "2023-01-01T01:00",
                    weatherCode: 23,
                    windDirection10m: 330,
                    windSpeed10m: 10,
                },
            });
            expect(controller.wind.innerText).toBe("Wind: 10 km/h, direction Northwest");
        });
        it("Cardinal directions are not shown in case the value is invalid", () => {
            controller.refreshView({
                latitude: 51.1,
                longitude: 45.3,
                current: {
                    temperature2m: 23,
                    time: "2023-01-01T01:00",
                    weatherCode: 23,
                    windDirection10m: 380,
                    windSpeed10m: 10,
                },
            });
            expect(controller.wind.innerText).toBe("Wind: 10 km/h, direction undefined");
        });
        it("Adds placeholders if received data doesn't contain currentWeather info", () => {
            controller.refreshView({ latitude: 51.1, longitude: 45.3 });
            expect(controller.temperatureElement.innerHTML).toBe("--°C");
        });
    });
});
