import { Model } from "../../../models/model";
import { BaseController } from "../../baseController";
import { HourlyResponse, V1ForecastGet200Response } from "./open-meteo-client";
import { weatherForecastAPI } from "./openMeteoClient";

interface WeatherCode {
    code: number;
    description: string;
    icon: string;
}

interface WeatherConfig {
    locale: Intl.LocalesArgument;
}

const defaultConfig: WeatherConfig = {
    locale: "de-DE",
};

/**
 * All 8 cardinal directions in full Text
 */
type CardinalDirection = "North" | "Northeast" | "East" | "Southeast" | "South" | "Southwest" | "West" | "Northwest";

/**
 * Controller for the circum weather app, a small web app used as iframe for testing in circum
 * Belongs to /src/views/frames/Weather.html
 */
export class WeatherController extends BaseController<V1ForecastGet200Response> {
    protected _model: Model<() => Promise<V1ForecastGet200Response>>;
    private position: GeolocationPosition | undefined = undefined;
    private weatherCodes: WeatherCode[] = [
        {
            code: 1,
            description: "Clear sky",
            icon: "bi-brightness-high-fill",
        },
        {
            code: 2,
            description: "Mainly clear",
            icon: "bi-cloud-sun",
        },
        {
            code: 2,
            description: "Partly cloudy",
            icon: "bi-cloud",
        },
        {
            code: 3,
            description: "Overcast",
            icon: "bi-cloud-fill",
        },
        {
            code: 45,
            description: "Fog",
            icon: "bi-water",
        },
        {
            code: 48,
            description: "Depositing rime fog",
            icon: "bi-water",
        },
        {
            code: 51,
            description: "Light drizzle",
            icon: "bi-cloud-drizzle",
        },
        {
            code: 53,
            description: "Moderate drizzle",
            icon: "bi-cloud-drizzle-fill",
        },
        {
            code: 55,
            description: "Dense drizzle",
            icon: "bi-cloud-drizzle-fill",
        },
        {
            code: 56,
            description: "Light freezing drizzle",
            icon: "bi-cloud-drizzle",
        },
        {
            code: 57,
            description: "Dense freezing drizzle",
            icon: "bi-cloud-drizzle-fill",
        },
        {
            code: 61,
            description: "Slight rain",
            icon: "bi-cloud-rain-fill",
        },
        {
            code: 63,
            description: "Moderate rain",
            icon: "bi-cloud-rain-heavy-fill",
        },
        {
            code: 65,
            description: "Heavy rain",
            icon: "bi-cloud-rain-heavy-fill",
        },
        {
            code: 66,
            description: "Light freezing rain",
            icon: "bi-cloud-rain",
        },
        {
            code: 67,
            description: "Heavy freezing rain",
            icon: "bi-cloud-rain-heavy-fill",
        },
        {
            code: 71,
            description: "Slight snow fall",
            icon: "bi-cloud-snow-fill",
        },
        {
            code: 73,
            description: "Moderate snow fall",
            icon: "bi-cloud-snow-fill",
        },
        {
            code: 75,
            description: "Heavy snow fall",
            icon: "bi-cloud-snow-fill",
        },
        {
            code: 77,
            description: "Snow grains",
            icon: "bi-cloud-snow-fill",
        },
        {
            code: 77,
            description: "Snow grains",
            icon: "bi-cloud-snow-fill",
        },
        {
            code: 80,
            description: "Slight rain showers",
            icon: "bi-cloud-rain",
        },
        {
            code: 81,
            description: "Moderate rain showers",
            icon: "bi-cloud-rain-heavy",
        },
        {
            code: 82,
            description: "Heavy rain showers",
            icon: "bi-cloud-rain-heavy",
        },
        {
            code: 85,
            description: "Slight show showers",
            icon: "bi-cloud-snow",
        },
        {
            code: 86,
            description: "Heavy show showers",
            icon: "bi-cloud-snow",
        },
        {
            code: 95,
            description: "Thunderstorm",
            icon: "bi-cloud-lightning-rain-fill",
        },
        {
            code: 96,
            description: "Thunderstorm with slight hail",
            icon: "bi-cloud-lightning-rain-fill",
        },
        {
            code: 99,
            description: "Thunderstorm with heavy hail",
            icon: "bi-cloud-lightning-rain-fill",
        },
    ];
    /**
     * @param autoRefresh - Interval in milliseconds in which the weather data is refreshed
     */
    constructor(autoRefresh = 60000) {
        super();
        this._model = new Model(this.getData.bind(this), this.refreshView.bind(this));
        setInterval(this.syncRefresh.bind(this), autoRefresh);
    }
    /**
     * Returns the geolocation
     * @param refresh - If set to false, a cache instance variable will be used, if possible
     */
    public async getCoordinates(refresh = false): Promise<GeolocationCoordinates> {
        if (!this.position || refresh) {
            this.position = await this.getPosition();
        }
        return this.position.coords;
    }
    protected syncRefresh(): void {
        void this.refresh();
    }
    /**
     * Triggers all listeners registered for the model
     * Shorthand for this._model.refresh()
     */
    public async refresh(): Promise<void> {
        return this._model.refresh();
    }
    private findWeatherCode(code: number): WeatherCode | undefined {
        return this.weatherCodes.find((weatherCode) => {
            return weatherCode.code === code;
        });
    }
    private getCardinalDirection(direction: number): CardinalDirection | undefined {
        if ((direction > 337 && direction <= 360) || (direction >= 0 && direction <= 22)) return "North";
        if (direction > 22 && direction <= 67) return "Northeast";
        if (direction > 67 && direction <= 112) return "East";
        if (direction > 112 && direction <= 157) return "Southeast";
        if (direction > 157 && direction <= 202) return "South";
        if (direction > 202 && direction <= 247) return "Southwest";
        if (direction > 247 && direction <= 292) return "West";
        if (direction > 292 && direction <= 337) return "Northwest";
        return undefined;
    }
    private toStringOrEmpty(num: number | string | undefined): string {
        if (!num) return "";
        return num.toString();
    }
    protected refreshView(data: V1ForecastGet200Response | Error): void {
        if (data instanceof Error) {
            return;
        }
        this.locationElement.textContent = `${this.toStringOrEmpty(data.latitude)}, ${this.toStringOrEmpty(
            data.longitude,
        )}`;
        if (
            data.current?.temperature2m &&
            data.current.weatherCode &&
            data.current.windSpeed10m &&
            data.current.windDirection10m
        ) {
            this.temperatureElement.textContent = `${data.current.temperature2m.toString()}°C`;
            const currentDateTime = `${new Date(data.current.time).toLocaleDateString(defaultConfig.locale)} ${new Date(
                data.current.time,
            ).toLocaleTimeString(defaultConfig.locale)}`;
            this.lastUpdatedElement.textContent = `last updated: ${currentDateTime}`;
            let weatherIconCode = this.findWeatherCode(data.current.weatherCode);
            if (!weatherIconCode) {
                weatherIconCode = {
                    code: data.current.weatherCode,
                    description: `Unknown Weather code: ${data.current.weatherCode.toString()}`,
                    icon: "question-circle-fill",
                };
            }
            this.weatherIcon.className = `bi ${weatherIconCode.icon} main-weather`;
            this.weatherDescription.innerText = weatherIconCode.description;
            this.wind.innerText = `Wind: ${data.current.windSpeed10m.toString()} km/h, direction ${this.toStringOrEmpty(
                this.getCardinalDirection(data.current.windDirection10m),
            )}`;
        } else {
            this.temperatureElement.textContent = `--°C`;
            this.lastUpdatedElement.textContent = `--`;
            this.weatherIcon.className = "question-circle-fill";
            this.weatherDescription.innerText = "Unknown weather condition";
            this.wind.innerText = "";
        }
        if (data.hourly) {
            this.addHourlyForecasts(data.hourly);
        }
    }
    /** Returns the location description HTML element */
    get locationElement(): HTMLHeadingElement {
        return this.typedElement("location", "h2").get();
    }
    /** Returns the temparature label HTML element */
    get temperatureElement(): HTMLHeadingElement {
        return this.typedElement("temperature", "h1").get();
    }
    /** Returns the "last updated" HTML text element */
    get lastUpdatedElement(): HTMLElement {
        return this.typedElement("lastUpdated", "small").get();
    }
    /** Returns the weather icon HTML element */
    get weatherIcon(): HTMLHeadingElement {
        return this.typedElement("weatherIcon", "h3").get();
    }
    /** Returns the weather description HTML text element */
    get weatherDescription(): HTMLHeadingElement {
        return this.typedElement("weatherDescription", "h2").get();
    }
    /** Returns the wind description HTML text element */
    get wind(): HTMLHeadingElement {
        return this.typedElement("wind", "h2").get();
    }
    /** Returns the HTML div containing the hourly forecast */
    get forecastHourlyDiv(): HTMLDivElement {
        return this.typedElement("forecastHourlyDiv", "div").get();
    }
    private addHourlyForecasts(forecasts: HourlyResponse): void {
        if (!forecasts.weatherCode || !forecasts.temperature2m) {
            return;
        }
        this.forecastHourlyDiv.textContent = "";
        for (let index = 0; index < forecasts.time.length; index++) {
            const weatherCode = this.findWeatherCode(forecasts.weatherCode[index]);
            if (new Date(forecasts.time[index]) < new Date() || !weatherCode) {
                continue;
            }
            const div = document.createElement("div");
            div.id = `forecastHourly${index.toString()}`;
            div.className = "row justify-content-start";
            const time = document.createElement("p");
            time.id = `forecastHourlyTime${index.toString()}`;
            time.className = "col-md-auto light-text";
            time.innerText = `${new Date(forecasts.time[index]).toLocaleDateString(defaultConfig.locale)} ${new Date(
                forecasts.time[index],
            ).toLocaleTimeString(defaultConfig.locale)}`;
            const icon = document.createElement("i");
            icon.id = `forecastHourlyIcon${index.toString()}`;
            icon.className = `col-md-auto bi ${weatherCode.icon}`;
            const temparature = document.createElement("p");
            temparature.id = `forecastHourlyTemparature${index.toString()}`;
            temparature.className = "col-md-auto mr-3 green-font";
            temparature.innerText = `${forecasts.temperature2m[index].toString()}°C`;
            const weatherDescription = document.createElement("p");
            weatherDescription.id = `forecastHourlyWeatherDescription${index.toString()}`;
            weatherDescription.className = "col-md-auto ml-auto";
            weatherDescription.innerText = weatherCode.description;
            div.appendChild(time);
            div.appendChild(icon);
            div.appendChild(temparature);
            div.appendChild(weatherDescription);
            this.forecastHourlyDiv.appendChild(div);
        }
    }
    /** A function to get the weather data used to initialize the model */
    public async getData(): Promise<V1ForecastGet200Response> {
        const api = weatherForecastAPI;
        const coordinates = await this.getCoordinates().catch();
        const res = await api.v1ForecastGet(
            coordinates.latitude,
            coordinates.longitude,
            ["temperature_2m", "weather_code", "wind_direction_10m", "wind_speed_10m"],
            undefined,
            ["temperature_2m", "weather_code", "wind_direction_10m", "wind_speed_10m"],
            "celsius",
            "kmh",
            "iso8601",
            "CET",
            undefined,
            2,
        );
        return res;
    }
}
