import { ResponseContext, RequestContext, HttpFile, HttpInfo } from '../http/http';
import { Configuration} from '../configuration'

import { CurrentWeather } from '../models/CurrentWeather';
import { DailyResponse } from '../models/DailyResponse';
import { HourlyResponse } from '../models/HourlyResponse';
import { V1ForecastGet200Response } from '../models/V1ForecastGet200Response';
import { V1ForecastGet400Response } from '../models/V1ForecastGet400Response';

import { ObservableWeatherForecastAPIsApi } from "./ObservableAPI";
import { WeatherForecastAPIsApiRequestFactory, WeatherForecastAPIsApiResponseProcessor} from "../apis/WeatherForecastAPIsApi";

export interface WeatherForecastAPIsApiV1ForecastGetRequest {
    /**
     * WGS84 coordinate
     * @type number
     * @memberof WeatherForecastAPIsApiv1ForecastGet
     */
    latitude: number
    /**
     * WGS84 coordinate
     * @type number
     * @memberof WeatherForecastAPIsApiv1ForecastGet
     */
    longitude: number
    /**
     * 
     * @type Array&lt;&#39;temperature_2m&#39; | &#39;relative_humidity_2m&#39; | &#39;dew_point_2m&#39; | &#39;apparent_temperature&#39; | &#39;pressure_msl&#39; | &#39;cloud_cover&#39; | &#39;cloud_cover_low&#39; | &#39;cloud_cover_mid&#39; | &#39;cloud_cover_high&#39; | &#39;wind_speed_10m&#39; | &#39;wind_speed_80m&#39; | &#39;wind_speed_120m&#39; | &#39;wind_speed_180m&#39; | &#39;wind_direction_10m&#39; | &#39;wind_direction_80m&#39; | &#39;wind_direction_120m&#39; | &#39;wind_direction_180m&#39; | &#39;wind_gusts_10m&#39; | &#39;shortwave_radiation&#39; | &#39;direct_radiation&#39; | &#39;direct_normal_irradiance&#39; | &#39;diffuse_radiation&#39; | &#39;vapour_pressure_deficit&#39; | &#39;evapotranspiration&#39; | &#39;precipitation&#39; | &#39;weather_code&#39; | &#39;snow_height&#39; | &#39;freezing_level_height&#39; | &#39;soil_temperature_0cm&#39; | &#39;soil_temperature_6cm&#39; | &#39;soil_temperature_18cm&#39; | &#39;soil_temperature_54cm&#39; | &#39;soil_moisture_0_1cm&#39; | &#39;soil_moisture_1_3cm&#39; | &#39;soil_moisture_3_9cm&#39; | &#39;soil_moisture_9_27cm&#39; | &#39;soil_moisture_27_81cm&#39;&gt;
     * @memberof WeatherForecastAPIsApiv1ForecastGet
     */
    hourly?: Array<'temperature_2m' | 'relative_humidity_2m' | 'dew_point_2m' | 'apparent_temperature' | 'pressure_msl' | 'cloud_cover' | 'cloud_cover_low' | 'cloud_cover_mid' | 'cloud_cover_high' | 'wind_speed_10m' | 'wind_speed_80m' | 'wind_speed_120m' | 'wind_speed_180m' | 'wind_direction_10m' | 'wind_direction_80m' | 'wind_direction_120m' | 'wind_direction_180m' | 'wind_gusts_10m' | 'shortwave_radiation' | 'direct_radiation' | 'direct_normal_irradiance' | 'diffuse_radiation' | 'vapour_pressure_deficit' | 'evapotranspiration' | 'precipitation' | 'weather_code' | 'snow_height' | 'freezing_level_height' | 'soil_temperature_0cm' | 'soil_temperature_6cm' | 'soil_temperature_18cm' | 'soil_temperature_54cm' | 'soil_moisture_0_1cm' | 'soil_moisture_1_3cm' | 'soil_moisture_3_9cm' | 'soil_moisture_9_27cm' | 'soil_moisture_27_81cm'>
    /**
     * 
     * @type Array&lt;&#39;temperature_2m_max&#39; | &#39;temperature_2m_min&#39; | &#39;apparent_temperature_max&#39; | &#39;apparent_temperature_min&#39; | &#39;precipitation_sum&#39; | &#39;precipitation_hours&#39; | &#39;weather_code&#39; | &#39;sunrise&#39; | &#39;sunset&#39; | &#39;wind_speed_10m_max&#39; | &#39;wind_gusts_10m_max&#39; | &#39;wind_direction_10m_dominant&#39; | &#39;shortwave_radiation_sum&#39; | &#39;uv_index_max&#39; | &#39;uv_index_clear_sky_max&#39; | &#39;et0_fao_evapotranspiration&#39;&gt;
     * @memberof WeatherForecastAPIsApiv1ForecastGet
     */
    daily?: Array<'temperature_2m_max' | 'temperature_2m_min' | 'apparent_temperature_max' | 'apparent_temperature_min' | 'precipitation_sum' | 'precipitation_hours' | 'weather_code' | 'sunrise' | 'sunset' | 'wind_speed_10m_max' | 'wind_gusts_10m_max' | 'wind_direction_10m_dominant' | 'shortwave_radiation_sum' | 'uv_index_max' | 'uv_index_clear_sky_max' | 'et0_fao_evapotranspiration'>
    /**
     * 
     * @type Array&lt;&#39;temperature_2m&#39; | &#39;weather_code&#39; | &#39;wind_speed_10m&#39; | &#39;wind_direction_10m&#39;&gt;
     * @memberof WeatherForecastAPIsApiv1ForecastGet
     */
    current?: Array<'temperature_2m' | 'weather_code' | 'wind_speed_10m' | 'wind_direction_10m'>
    /**
     * 
     * @type &#39;celsius&#39; | &#39;fahrenheit&#39;
     * @memberof WeatherForecastAPIsApiv1ForecastGet
     */
    temperatureUnit?: 'celsius' | 'fahrenheit'
    /**
     * 
     * @type &#39;kmh&#39; | &#39;ms&#39; | &#39;mph&#39; | &#39;kn&#39;
     * @memberof WeatherForecastAPIsApiv1ForecastGet
     */
    windSpeedUnit?: 'kmh' | 'ms' | 'mph' | 'kn'
    /**
     * If format &#x60;unixtime&#x60; is selected, all time values are returned in UNIX epoch time in seconds. Please not that all time is then in GMT+0! For daily values with unix timestamp, please apply &#x60;utc_offset_seconds&#x60; again to get the correct date.
     * @type &#39;iso8601&#39; | &#39;unixtime&#39;
     * @memberof WeatherForecastAPIsApiv1ForecastGet
     */
    timeformat?: 'iso8601' | 'unixtime'
    /**
     * If &#x60;timezone&#x60; is set, all timestamps are returned as local-time and data is returned starting at 0:00 local-time. Any time zone name from the [time zone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) is supported.
     * @type string
     * @memberof WeatherForecastAPIsApiv1ForecastGet
     */
    timezone?: string
    /**
     * If &#x60;past_days&#x60; is set, yesterdays or the day before yesterdays data are also returned.
     * @type 1 | 2
     * @memberof WeatherForecastAPIsApiv1ForecastGet
     */
    pastDays?: 1 | 2
    /**
     * Number of days for the forcast. If set to 1, only the current day is selected.
     * @type number
     * @memberof WeatherForecastAPIsApiv1ForecastGet
     */
    forecastDays?: number
}

export class ObjectWeatherForecastAPIsApi {
    private api: ObservableWeatherForecastAPIsApi

    public constructor(configuration: Configuration, requestFactory?: WeatherForecastAPIsApiRequestFactory, responseProcessor?: WeatherForecastAPIsApiResponseProcessor) {
        this.api = new ObservableWeatherForecastAPIsApi(configuration, requestFactory, responseProcessor);
    }

    /**
     * 7 day weather variables in hourly and daily resolution for given WGS84 latitude and longitude coordinates. Available worldwide.
     * 7 day weather forecast for coordinates
     * @param param the request object
     */
    public v1ForecastGetWithHttpInfo(param: WeatherForecastAPIsApiV1ForecastGetRequest, options?: Configuration): Promise<HttpInfo<V1ForecastGet200Response>> {
        return this.api.v1ForecastGetWithHttpInfo(param.latitude, param.longitude, param.hourly, param.daily, param.current, param.temperatureUnit, param.windSpeedUnit, param.timeformat, param.timezone, param.pastDays, param.forecastDays,  options).toPromise();
    }

    /**
     * 7 day weather variables in hourly and daily resolution for given WGS84 latitude and longitude coordinates. Available worldwide.
     * 7 day weather forecast for coordinates
     * @param param the request object
     */
    public v1ForecastGet(param: WeatherForecastAPIsApiV1ForecastGetRequest, options?: Configuration): Promise<V1ForecastGet200Response> {
        return this.api.v1ForecastGet(param.latitude, param.longitude, param.hourly, param.daily, param.current, param.temperatureUnit, param.windSpeedUnit, param.timeformat, param.timezone, param.pastDays, param.forecastDays,  options).toPromise();
    }

}
