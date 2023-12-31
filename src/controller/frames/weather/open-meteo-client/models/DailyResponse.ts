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

export class DailyResponse {
    'time': Array<string>;
    'temperature2mMax'?: Array<number>;
    'temperature2mMin'?: Array<number>;
    'apparentTemperatureMax'?: Array<number>;
    'apparentTemperatureMin'?: Array<number>;
    'precipitationSum'?: Array<number>;
    'precipitationHours'?: Array<number>;
    'weatherCode'?: Array<number>;
    'sunrise'?: Array<number>;
    'sunset'?: Array<number>;
    'windSpeed10mMax'?: Array<number>;
    'windGusts10mMax'?: Array<number>;
    'windDirection10mDominant'?: Array<number>;
    'shortwaveRadiationSum'?: Array<number>;
    'uvIndexMax'?: Array<number>;
    'uvIndexClearSkyMax'?: Array<number>;
    'et0FaoEvapotranspiration'?: Array<number>;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "time",
            "baseName": "time",
            "type": "Array<string>",
            "format": ""
        },
        {
            "name": "temperature2mMax",
            "baseName": "temperature_2m_max",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "temperature2mMin",
            "baseName": "temperature_2m_min",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "apparentTemperatureMax",
            "baseName": "apparent_temperature_max",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "apparentTemperatureMin",
            "baseName": "apparent_temperature_min",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "precipitationSum",
            "baseName": "precipitation_sum",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "precipitationHours",
            "baseName": "precipitation_hours",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "weatherCode",
            "baseName": "weather_code",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "sunrise",
            "baseName": "sunrise",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "sunset",
            "baseName": "sunset",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "windSpeed10mMax",
            "baseName": "wind_speed_10m_max",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "windGusts10mMax",
            "baseName": "wind_gusts_10m_max",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "windDirection10mDominant",
            "baseName": "wind_direction_10m_dominant",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "shortwaveRadiationSum",
            "baseName": "shortwave_radiation_sum",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "uvIndexMax",
            "baseName": "uv_index_max",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "uvIndexClearSkyMax",
            "baseName": "uv_index_clear_sky_max",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "et0FaoEvapotranspiration",
            "baseName": "et0_fao_evapotranspiration",
            "type": "Array<number>",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return DailyResponse.attributeTypeMap;
    }

    public constructor() {
    }
}

