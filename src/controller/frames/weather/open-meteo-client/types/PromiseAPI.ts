import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration} from '../configuration'

import { CurrentWeather } from '../models/CurrentWeather';
import { DailyResponse } from '../models/DailyResponse';
import { HourlyResponse } from '../models/HourlyResponse';
import { V1ForecastGet200Response } from '../models/V1ForecastGet200Response';
import { V1ForecastGet400Response } from '../models/V1ForecastGet400Response';
import { ObservableWeatherForecastAPIsApi } from './ObservableAPI';

import { WeatherForecastAPIsApiRequestFactory, WeatherForecastAPIsApiResponseProcessor} from "../apis/WeatherForecastAPIsApi";
export class PromiseWeatherForecastAPIsApi {
    private api: ObservableWeatherForecastAPIsApi

    public constructor(
        configuration: Configuration,
        requestFactory?: WeatherForecastAPIsApiRequestFactory,
        responseProcessor?: WeatherForecastAPIsApiResponseProcessor
    ) {
        this.api = new ObservableWeatherForecastAPIsApi(configuration, requestFactory, responseProcessor);
    }

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
    public v1ForecastGetWithHttpInfo(latitude: number, longitude: number, hourly?: Array<'temperature_2m' | 'relative_humidity_2m' | 'dew_point_2m' | 'apparent_temperature' | 'pressure_msl' | 'cloud_cover' | 'cloud_cover_low' | 'cloud_cover_mid' | 'cloud_cover_high' | 'wind_speed_10m' | 'wind_speed_80m' | 'wind_speed_120m' | 'wind_speed_180m' | 'wind_direction_10m' | 'wind_direction_80m' | 'wind_direction_120m' | 'wind_direction_180m' | 'wind_gusts_10m' | 'shortwave_radiation' | 'direct_radiation' | 'direct_normal_irradiance' | 'diffuse_radiation' | 'vapour_pressure_deficit' | 'evapotranspiration' | 'precipitation' | 'weather_code' | 'snow_height' | 'freezing_level_height' | 'soil_temperature_0cm' | 'soil_temperature_6cm' | 'soil_temperature_18cm' | 'soil_temperature_54cm' | 'soil_moisture_0_1cm' | 'soil_moisture_1_3cm' | 'soil_moisture_3_9cm' | 'soil_moisture_9_27cm' | 'soil_moisture_27_81cm'>, daily?: Array<'temperature_2m_max' | 'temperature_2m_min' | 'apparent_temperature_max' | 'apparent_temperature_min' | 'precipitation_sum' | 'precipitation_hours' | 'weather_code' | 'sunrise' | 'sunset' | 'wind_speed_10m_max' | 'wind_gusts_10m_max' | 'wind_direction_10m_dominant' | 'shortwave_radiation_sum' | 'uv_index_max' | 'uv_index_clear_sky_max' | 'et0_fao_evapotranspiration'>, current?: Array<'temperature_2m' | 'weather_code' | 'wind_speed_10m' | 'wind_direction_10m'>, temperatureUnit?: 'celsius' | 'fahrenheit', windSpeedUnit?: 'kmh' | 'ms' | 'mph' | 'kn', timeformat?: 'iso8601' | 'unixtime', timezone?: string, pastDays?: 1 | 2, forecastDays?: number, _options?: Configuration): Promise<HttpInfo<V1ForecastGet200Response>> {
        const result = this.api.v1ForecastGetWithHttpInfo(latitude, longitude, hourly, daily, current, temperatureUnit, windSpeedUnit, timeformat, timezone, pastDays, forecastDays, _options);
        return result.toPromise();
    }

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
    public v1ForecastGet(latitude: number, longitude: number, hourly?: Array<'temperature_2m' | 'relative_humidity_2m' | 'dew_point_2m' | 'apparent_temperature' | 'pressure_msl' | 'cloud_cover' | 'cloud_cover_low' | 'cloud_cover_mid' | 'cloud_cover_high' | 'wind_speed_10m' | 'wind_speed_80m' | 'wind_speed_120m' | 'wind_speed_180m' | 'wind_direction_10m' | 'wind_direction_80m' | 'wind_direction_120m' | 'wind_direction_180m' | 'wind_gusts_10m' | 'shortwave_radiation' | 'direct_radiation' | 'direct_normal_irradiance' | 'diffuse_radiation' | 'vapour_pressure_deficit' | 'evapotranspiration' | 'precipitation' | 'weather_code' | 'snow_height' | 'freezing_level_height' | 'soil_temperature_0cm' | 'soil_temperature_6cm' | 'soil_temperature_18cm' | 'soil_temperature_54cm' | 'soil_moisture_0_1cm' | 'soil_moisture_1_3cm' | 'soil_moisture_3_9cm' | 'soil_moisture_9_27cm' | 'soil_moisture_27_81cm'>, daily?: Array<'temperature_2m_max' | 'temperature_2m_min' | 'apparent_temperature_max' | 'apparent_temperature_min' | 'precipitation_sum' | 'precipitation_hours' | 'weather_code' | 'sunrise' | 'sunset' | 'wind_speed_10m_max' | 'wind_gusts_10m_max' | 'wind_direction_10m_dominant' | 'shortwave_radiation_sum' | 'uv_index_max' | 'uv_index_clear_sky_max' | 'et0_fao_evapotranspiration'>, current?: Array<'temperature_2m' | 'weather_code' | 'wind_speed_10m' | 'wind_direction_10m'>, temperatureUnit?: 'celsius' | 'fahrenheit', windSpeedUnit?: 'kmh' | 'ms' | 'mph' | 'kn', timeformat?: 'iso8601' | 'unixtime', timezone?: string, pastDays?: 1 | 2, forecastDays?: number, _options?: Configuration): Promise<V1ForecastGet200Response> {
        const result = this.api.v1ForecastGet(latitude, longitude, hourly, daily, current, temperatureUnit, windSpeedUnit, timeformat, timezone, pastDays, forecastDays, _options);
        return result.toPromise();
    }


}



