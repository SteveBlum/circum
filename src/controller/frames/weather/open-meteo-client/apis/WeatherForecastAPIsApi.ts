// TODO: better import syntax?
import {BaseAPIRequestFactory, RequiredError, COLLECTION_FORMATS} from './baseapi';
import {Configuration} from '../configuration';
import {RequestContext, HttpMethod, ResponseContext, HttpFile, HttpInfo} from '../http/http';
import {ObjectSerializer} from '../models/ObjectSerializer';
import {ApiException} from './exception';
import {canConsumeForm, isCodeInRange} from '../util';
import {SecurityAuthentication} from '../auth/auth';


import { V1ForecastGet200Response } from '../models/V1ForecastGet200Response';
import { V1ForecastGet400Response } from '../models/V1ForecastGet400Response';

/**
 * no description
 */
export class WeatherForecastAPIsApiRequestFactory extends BaseAPIRequestFactory {

    /**
     * 7 day weather variables in hourly and daily resolution for given WGS84 latitude and longitude coordinates. Available worldwide.
     * 7 day weather forecast for coordinates
     * @param latitude WGS84 coordinate
     * @param longitude WGS84 coordinate
     * @param hourly 
     * @param daily 
     * @param current 
     * @param temperatureUnit 
     * @param windSpeedUnit 
     * @param timeformat If format &#x60;unixtime&#x60; is selected, all time values are returned in UNIX epoch time in seconds. Please not that all time is then in GMT+0! For daily values with unix timestamp, please apply &#x60;utc_offset_seconds&#x60; again to get the correct date.
     * @param timezone If &#x60;timezone&#x60; is set, all timestamps are returned as local-time and data is returned starting at 0:00 local-time. Any time zone name from the [time zone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) is supported.
     * @param pastDays If &#x60;past_days&#x60; is set, yesterdays or the day before yesterdays data are also returned.
     * @param forecastDays Number of days for the forcast. If set to 1, only the current day is selected.
     */
    public async v1ForecastGet(latitude: number, longitude: number, hourly?: Array<'temperature_2m' | 'relative_humidity_2m' | 'dew_point_2m' | 'apparent_temperature' | 'pressure_msl' | 'cloud_cover' | 'cloud_cover_low' | 'cloud_cover_mid' | 'cloud_cover_high' | 'wind_speed_10m' | 'wind_speed_80m' | 'wind_speed_120m' | 'wind_speed_180m' | 'wind_direction_10m' | 'wind_direction_80m' | 'wind_direction_120m' | 'wind_direction_180m' | 'wind_gusts_10m' | 'shortwave_radiation' | 'direct_radiation' | 'direct_normal_irradiance' | 'diffuse_radiation' | 'vapour_pressure_deficit' | 'evapotranspiration' | 'precipitation' | 'weather_code' | 'snow_height' | 'freezing_level_height' | 'soil_temperature_0cm' | 'soil_temperature_6cm' | 'soil_temperature_18cm' | 'soil_temperature_54cm' | 'soil_moisture_0_1cm' | 'soil_moisture_1_3cm' | 'soil_moisture_3_9cm' | 'soil_moisture_9_27cm' | 'soil_moisture_27_81cm'>, daily?: Array<'temperature_2m_max' | 'temperature_2m_min' | 'apparent_temperature_max' | 'apparent_temperature_min' | 'precipitation_sum' | 'precipitation_hours' | 'weather_code' | 'sunrise' | 'sunset' | 'wind_speed_10m_max' | 'wind_gusts_10m_max' | 'wind_direction_10m_dominant' | 'shortwave_radiation_sum' | 'uv_index_max' | 'uv_index_clear_sky_max' | 'et0_fao_evapotranspiration'>, current?: Array<'temperature_2m' | 'weather_code' | 'wind_speed_10m' | 'wind_direction_10m'>, temperatureUnit?: 'celsius' | 'fahrenheit', windSpeedUnit?: 'kmh' | 'ms' | 'mph' | 'kn', timeformat?: 'iso8601' | 'unixtime', timezone?: string, pastDays?: 1 | 2, forecastDays?: number, _options?: Configuration): Promise<RequestContext> {
        let _config = _options || this.configuration;

        // verify required parameter 'latitude' is not null or undefined
        if (latitude === null || latitude === undefined) {
            throw new RequiredError("WeatherForecastAPIsApi", "v1ForecastGet", "latitude");
        }


        // verify required parameter 'longitude' is not null or undefined
        if (longitude === null || longitude === undefined) {
            throw new RequiredError("WeatherForecastAPIsApi", "v1ForecastGet", "longitude");
        }











        // Path Params
        const localVarPath = '/v1/forecast';

        // Make Request Context
        const requestContext = _config.baseServer.makeRequestContext(localVarPath, HttpMethod.GET);
        requestContext.setHeaderParam("Accept", "application/json, */*;q=0.8")

        // Query Params
        if (hourly !== undefined) {
            requestContext.setQueryParam("hourly", ObjectSerializer.serialize(hourly, "Array<'temperature_2m' | 'relative_humidity_2m' | 'dew_point_2m' | 'apparent_temperature' | 'pressure_msl' | 'cloud_cover' | 'cloud_cover_low' | 'cloud_cover_mid' | 'cloud_cover_high' | 'wind_speed_10m' | 'wind_speed_80m' | 'wind_speed_120m' | 'wind_speed_180m' | 'wind_direction_10m' | 'wind_direction_80m' | 'wind_direction_120m' | 'wind_direction_180m' | 'wind_gusts_10m' | 'shortwave_radiation' | 'direct_radiation' | 'direct_normal_irradiance' | 'diffuse_radiation' | 'vapour_pressure_deficit' | 'evapotranspiration' | 'precipitation' | 'weather_code' | 'snow_height' | 'freezing_level_height' | 'soil_temperature_0cm' | 'soil_temperature_6cm' | 'soil_temperature_18cm' | 'soil_temperature_54cm' | 'soil_moisture_0_1cm' | 'soil_moisture_1_3cm' | 'soil_moisture_3_9cm' | 'soil_moisture_9_27cm' | 'soil_moisture_27_81cm'>", ""));
        }

        // Query Params
        if (daily !== undefined) {
            requestContext.setQueryParam("daily", ObjectSerializer.serialize(daily, "Array<'temperature_2m_max' | 'temperature_2m_min' | 'apparent_temperature_max' | 'apparent_temperature_min' | 'precipitation_sum' | 'precipitation_hours' | 'weather_code' | 'sunrise' | 'sunset' | 'wind_speed_10m_max' | 'wind_gusts_10m_max' | 'wind_direction_10m_dominant' | 'shortwave_radiation_sum' | 'uv_index_max' | 'uv_index_clear_sky_max' | 'et0_fao_evapotranspiration'>", ""));
        }

        // Query Params
        if (latitude !== undefined) {
            requestContext.setQueryParam("latitude", ObjectSerializer.serialize(latitude, "number", "float"));
        }

        // Query Params
        if (longitude !== undefined) {
            requestContext.setQueryParam("longitude", ObjectSerializer.serialize(longitude, "number", "float"));
        }

        // Query Params
        if (current !== undefined) {
            requestContext.setQueryParam("current", ObjectSerializer.serialize(current, "Array<'temperature_2m' | 'weather_code' | 'wind_speed_10m' | 'wind_direction_10m'>", ""));
        }

        // Query Params
        if (temperatureUnit !== undefined) {
            requestContext.setQueryParam("temperature_unit", ObjectSerializer.serialize(temperatureUnit, "'celsius' | 'fahrenheit'", ""));
        }

        // Query Params
        if (windSpeedUnit !== undefined) {
            requestContext.setQueryParam("wind_speed_unit", ObjectSerializer.serialize(windSpeedUnit, "'kmh' | 'ms' | 'mph' | 'kn'", ""));
        }

        // Query Params
        if (timeformat !== undefined) {
            requestContext.setQueryParam("timeformat", ObjectSerializer.serialize(timeformat, "'iso8601' | 'unixtime'", ""));
        }

        // Query Params
        if (timezone !== undefined) {
            requestContext.setQueryParam("timezone", ObjectSerializer.serialize(timezone, "string", ""));
        }

        // Query Params
        if (pastDays !== undefined) {
            requestContext.setQueryParam("past_days", ObjectSerializer.serialize(pastDays, "1 | 2", ""));
        }

        // Query Params
        if (forecastDays !== undefined) {
            requestContext.setQueryParam("forecast_days", ObjectSerializer.serialize(forecastDays, "number", ""));
        }


        
        const defaultAuth: SecurityAuthentication | undefined = _options?.authMethods?.default || this.configuration?.authMethods?.default
        if (defaultAuth?.applySecurityAuthentication) {
            await defaultAuth?.applySecurityAuthentication(requestContext);
        }

        return requestContext;
    }

}

export class WeatherForecastAPIsApiResponseProcessor {

    /**
     * Unwraps the actual response sent by the server from the response context and deserializes the response content
     * to the expected objects
     *
     * @params response Response returned by the server for a request to v1ForecastGet
     * @throws ApiException if the response code was not in [200, 299]
     */
     public async v1ForecastGetWithHttpInfo(response: ResponseContext): Promise<HttpInfo<V1ForecastGet200Response >> {
        const contentType = ObjectSerializer.normalizeMediaType(response.headers["content-type"]);
        if (isCodeInRange("200", response.httpStatusCode)) {
            const body: V1ForecastGet200Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "V1ForecastGet200Response", ""
            ) as V1ForecastGet200Response;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }
        if (isCodeInRange("400", response.httpStatusCode)) {
            const body: V1ForecastGet400Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "V1ForecastGet400Response", ""
            ) as V1ForecastGet400Response;
            throw new ApiException<V1ForecastGet400Response>(response.httpStatusCode, "Bad Request", body, response.headers);
        }

        // Work around for missing responses in specification, e.g. for petstore.yaml
        if (response.httpStatusCode >= 200 && response.httpStatusCode <= 299) {
            const body: V1ForecastGet200Response = ObjectSerializer.deserialize(
                ObjectSerializer.parse(await response.body.text(), contentType),
                "V1ForecastGet200Response", ""
            ) as V1ForecastGet200Response;
            return new HttpInfo(response.httpStatusCode, response.headers, response.body, body);
        }

        throw new ApiException<string | Blob | undefined>(response.httpStatusCode, "Unknown API Status Code!", await response.getBodyAsAny(), response.headers);
    }

}
