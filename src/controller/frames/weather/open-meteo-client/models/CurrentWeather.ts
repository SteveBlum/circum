/**
 * Open-Meteo APIs
 * Open-Meteo offers free weather forecast APIs for open-source developers and non-commercial use. No API key is required.
 *
 * OpenAPI spec version: 1.0
 * Contact: info@open-meteo.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { HttpFile } from '../http/http';

export class CurrentWeather {
    'time': string;
    'temperature2m'?: number;
    'windSpeed10m'?: number;
    'windDirection10m'?: number;
    'weatherCode'?: number;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "time",
            "baseName": "time",
            "type": "string",
            "format": ""
        },
        {
            "name": "temperature2m",
            "baseName": "temperature_2m",
            "type": "number",
            "format": ""
        },
        {
            "name": "windSpeed10m",
            "baseName": "wind_speed_10m",
            "type": "number",
            "format": ""
        },
        {
            "name": "windDirection10m",
            "baseName": "wind_direction_10m",
            "type": "number",
            "format": ""
        },
        {
            "name": "weatherCode",
            "baseName": "weather_code",
            "type": "number",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return CurrentWeather.attributeTypeMap;
    }

    public constructor() {
    }
}

