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

export class HourlyResponse {
    'time': Array<string>;
    'temperature2m'?: Array<number>;
    'relativeHumidity2m'?: Array<number>;
    'dewPoint2m'?: Array<number>;
    'apparentTemperature'?: Array<number>;
    'pressureMsl'?: Array<number>;
    'cloudCover'?: Array<number>;
    'cloudCoverLow'?: Array<number>;
    'cloudCoverMid'?: Array<number>;
    'cloudCoverHigh'?: Array<number>;
    'windSpeed10m'?: Array<number>;
    'windSpeed80m'?: Array<number>;
    'windSpeed120m'?: Array<number>;
    'windSpeed180m'?: Array<number>;
    'windDirection10m'?: Array<number>;
    'windDirection80m'?: Array<number>;
    'windDirection120m'?: Array<number>;
    'windDirection180m'?: Array<number>;
    'windGusts10m'?: Array<number>;
    'shortwaveRadiation'?: Array<number>;
    'directRadiation'?: Array<number>;
    'directNormalIrradiance'?: Array<number>;
    'diffuseRadiation'?: Array<number>;
    'vapourPressureDeficit'?: Array<number>;
    'evapotranspiration'?: Array<number>;
    'precipitation'?: Array<number>;
    'weatherCode'?: Array<number>;
    'snowHeight'?: Array<number>;
    'freezingLevelHeight'?: Array<number>;
    'soilTemperature0cm'?: Array<number>;
    'soilTemperature6cm'?: Array<number>;
    'soilTemperature18cm'?: Array<number>;
    'soilTemperature54cm'?: Array<number>;
    'soilMoisture01cm'?: Array<number>;
    'soilMoisture13cm'?: Array<number>;
    'soilMoisture39cm'?: Array<number>;
    'soilMoisture927cm'?: Array<number>;
    'soilMoisture2781cm'?: Array<number>;

    static readonly discriminator: string | undefined = undefined;

    static readonly attributeTypeMap: Array<{name: string, baseName: string, type: string, format: string}> = [
        {
            "name": "time",
            "baseName": "time",
            "type": "Array<string>",
            "format": ""
        },
        {
            "name": "temperature2m",
            "baseName": "temperature_2m",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "relativeHumidity2m",
            "baseName": "relative_humidity_2m",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "dewPoint2m",
            "baseName": "dew_point_2m",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "apparentTemperature",
            "baseName": "apparent_temperature",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "pressureMsl",
            "baseName": "pressure_msl",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "cloudCover",
            "baseName": "cloud_cover",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "cloudCoverLow",
            "baseName": "cloud_cover_low",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "cloudCoverMid",
            "baseName": "cloud_cover_mid",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "cloudCoverHigh",
            "baseName": "cloud_cover_high",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "windSpeed10m",
            "baseName": "wind_speed_10m",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "windSpeed80m",
            "baseName": "wind_speed_80m",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "windSpeed120m",
            "baseName": "wind_speed_120m",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "windSpeed180m",
            "baseName": "wind_speed_180m",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "windDirection10m",
            "baseName": "wind_direction_10m",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "windDirection80m",
            "baseName": "wind_direction_80m",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "windDirection120m",
            "baseName": "wind_direction_120m",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "windDirection180m",
            "baseName": "wind_direction_180m",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "windGusts10m",
            "baseName": "wind_gusts_10m",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "shortwaveRadiation",
            "baseName": "shortwave_radiation",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "directRadiation",
            "baseName": "direct_radiation",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "directNormalIrradiance",
            "baseName": "direct_normal_irradiance",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "diffuseRadiation",
            "baseName": "diffuse_radiation",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "vapourPressureDeficit",
            "baseName": "vapour_pressure_deficit",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "evapotranspiration",
            "baseName": "evapotranspiration",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "precipitation",
            "baseName": "precipitation",
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
            "name": "snowHeight",
            "baseName": "snow_height",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "freezingLevelHeight",
            "baseName": "freezing_level_height",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "soilTemperature0cm",
            "baseName": "soil_temperature_0cm",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "soilTemperature6cm",
            "baseName": "soil_temperature_6cm",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "soilTemperature18cm",
            "baseName": "soil_temperature_18cm",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "soilTemperature54cm",
            "baseName": "soil_temperature_54cm",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "soilMoisture01cm",
            "baseName": "soil_moisture_0_1cm",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "soilMoisture13cm",
            "baseName": "soil_moisture_1_3cm",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "soilMoisture39cm",
            "baseName": "soil_moisture_3_9cm",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "soilMoisture927cm",
            "baseName": "soil_moisture_9_27cm",
            "type": "Array<number>",
            "format": ""
        },
        {
            "name": "soilMoisture2781cm",
            "baseName": "soil_moisture_27_81cm",
            "type": "Array<number>",
            "format": ""
        }    ];

    static getAttributeTypeMap() {
        return HourlyResponse.attributeTypeMap;
    }

    public constructor() {
    }
}

