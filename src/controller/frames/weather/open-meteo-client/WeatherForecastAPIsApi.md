# .WeatherForecastAPIsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**v1ForecastGet**](WeatherForecastAPIsApi.md#v1ForecastGet) | **GET** /v1/forecast | 7 day weather forecast for coordinates


# **v1ForecastGet**
> V1ForecastGet200Response v1ForecastGet()

7 day weather variables in hourly and daily resolution for given WGS84 latitude and longitude coordinates. Available worldwide.

### Example


```typescript
import {  } from '';
import * as fs from 'fs';

const configuration = .createConfiguration();
const apiInstance = new .WeatherForecastAPIsApi(configuration);

let body:.WeatherForecastAPIsApiV1ForecastGetRequest = {
  // number | WGS84 coordinate
  latitude: 3.14,
  // number | WGS84 coordinate
  longitude: 3.14,
  // Array<'temperature_2m' | 'relative_humidity_2m' | 'dew_point_2m' | 'apparent_temperature' | 'pressure_msl' | 'cloud_cover' | 'cloud_cover_low' | 'cloud_cover_mid' | 'cloud_cover_high' | 'wind_speed_10m' | 'wind_speed_80m' | 'wind_speed_120m' | 'wind_speed_180m' | 'wind_direction_10m' | 'wind_direction_80m' | 'wind_direction_120m' | 'wind_direction_180m' | 'wind_gusts_10m' | 'shortwave_radiation' | 'direct_radiation' | 'direct_normal_irradiance' | 'diffuse_radiation' | 'vapour_pressure_deficit' | 'evapotranspiration' | 'precipitation' | 'weather_code' | 'snow_height' | 'freezing_level_height' | 'soil_temperature_0cm' | 'soil_temperature_6cm' | 'soil_temperature_18cm' | 'soil_temperature_54cm' | 'soil_moisture_0_1cm' | 'soil_moisture_1_3cm' | 'soil_moisture_3_9cm' | 'soil_moisture_9_27cm' | 'soil_moisture_27_81cm'> (optional)
  hourly: [
    "temperature_2m",
  ],
  // Array<'temperature_2m_max' | 'temperature_2m_min' | 'apparent_temperature_max' | 'apparent_temperature_min' | 'precipitation_sum' | 'precipitation_hours' | 'weather_code' | 'sunrise' | 'sunset' | 'wind_speed_10m_max' | 'wind_gusts_10m_max' | 'wind_direction_10m_dominant' | 'shortwave_radiation_sum' | 'uv_index_max' | 'uv_index_clear_sky_max' | 'et0_fao_evapotranspiration'> (optional)
  daily: [
    "temperature_2m_max",
  ],
  // Array<'temperature_2m' | 'weather_code' | 'wind_speed_10m' | 'wind_direction_10m'> (optional)
  current: [
    "temperature_2m",
  ],
  // 'celsius' | 'fahrenheit' (optional)
  temperatureUnit: "celsius",
  // 'kmh' | 'ms' | 'mph' | 'kn' (optional)
  windSpeedUnit: "kmh",
  // 'iso8601' | 'unixtime' | If format `unixtime` is selected, all time values are returned in UNIX epoch time in seconds. Please not that all time is then in GMT+0! For daily values with unix timestamp, please apply `utc_offset_seconds` again to get the correct date. (optional)
  timeformat: "iso8601",
  // string | If `timezone` is set, all timestamps are returned as local-time and data is returned starting at 0:00 local-time. Any time zone name from the [time zone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) is supported. (optional)
  timezone: "timezone_example",
  // 1 | 2 | If `past_days` is set, yesterdays or the day before yesterdays data are also returned. (optional)
  pastDays: 1,
  // number | Number of days for the forcast. If set to 1, only the current day is selected. (optional)
  forecastDays: 1,
};

apiInstance.v1ForecastGet(body).then((data:any) => {
  console.log('API called successfully. Returned data: ' + data);
}).catch((error:any) => console.error(error));
```


### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **latitude** | [**number**] | WGS84 coordinate | defaults to undefined
 **longitude** | [**number**] | WGS84 coordinate | defaults to undefined
 **hourly** | **Array<&#39;temperature_2m&#39; &#124; &#39;relative_humidity_2m&#39; &#124; &#39;dew_point_2m&#39; &#124; &#39;apparent_temperature&#39; &#124; &#39;pressure_msl&#39; &#124; &#39;cloud_cover&#39; &#124; &#39;cloud_cover_low&#39; &#124; &#39;cloud_cover_mid&#39; &#124; &#39;cloud_cover_high&#39; &#124; &#39;wind_speed_10m&#39; &#124; &#39;wind_speed_80m&#39; &#124; &#39;wind_speed_120m&#39; &#124; &#39;wind_speed_180m&#39; &#124; &#39;wind_direction_10m&#39; &#124; &#39;wind_direction_80m&#39; &#124; &#39;wind_direction_120m&#39; &#124; &#39;wind_direction_180m&#39; &#124; &#39;wind_gusts_10m&#39; &#124; &#39;shortwave_radiation&#39; &#124; &#39;direct_radiation&#39; &#124; &#39;direct_normal_irradiance&#39; &#124; &#39;diffuse_radiation&#39; &#124; &#39;vapour_pressure_deficit&#39; &#124; &#39;evapotranspiration&#39; &#124; &#39;precipitation&#39; &#124; &#39;weather_code&#39; &#124; &#39;snow_height&#39; &#124; &#39;freezing_level_height&#39; &#124; &#39;soil_temperature_0cm&#39; &#124; &#39;soil_temperature_6cm&#39; &#124; &#39;soil_temperature_18cm&#39; &#124; &#39;soil_temperature_54cm&#39; &#124; &#39;soil_moisture_0_1cm&#39; &#124; &#39;soil_moisture_1_3cm&#39; &#124; &#39;soil_moisture_3_9cm&#39; &#124; &#39;soil_moisture_9_27cm&#39; &#124; &#39;soil_moisture_27_81cm&#39;>** |  | (optional) defaults to undefined
 **daily** | **Array<&#39;temperature_2m_max&#39; &#124; &#39;temperature_2m_min&#39; &#124; &#39;apparent_temperature_max&#39; &#124; &#39;apparent_temperature_min&#39; &#124; &#39;precipitation_sum&#39; &#124; &#39;precipitation_hours&#39; &#124; &#39;weather_code&#39; &#124; &#39;sunrise&#39; &#124; &#39;sunset&#39; &#124; &#39;wind_speed_10m_max&#39; &#124; &#39;wind_gusts_10m_max&#39; &#124; &#39;wind_direction_10m_dominant&#39; &#124; &#39;shortwave_radiation_sum&#39; &#124; &#39;uv_index_max&#39; &#124; &#39;uv_index_clear_sky_max&#39; &#124; &#39;et0_fao_evapotranspiration&#39;>** |  | (optional) defaults to undefined
 **current** | **Array<&#39;temperature_2m&#39; &#124; &#39;weather_code&#39; &#124; &#39;wind_speed_10m&#39; &#124; &#39;wind_direction_10m&#39;>** |  | (optional) defaults to undefined
 **temperatureUnit** | [**&#39;celsius&#39; | &#39;fahrenheit&#39;**]**Array<&#39;celsius&#39; &#124; &#39;fahrenheit&#39;>** |  | (optional) defaults to 'celsius'
 **windSpeedUnit** | [**&#39;kmh&#39; | &#39;ms&#39; | &#39;mph&#39; | &#39;kn&#39;**]**Array<&#39;kmh&#39; &#124; &#39;ms&#39; &#124; &#39;mph&#39; &#124; &#39;kn&#39;>** |  | (optional) defaults to 'kmh'
 **timeformat** | [**&#39;iso8601&#39; | &#39;unixtime&#39;**]**Array<&#39;iso8601&#39; &#124; &#39;unixtime&#39;>** | If format &#x60;unixtime&#x60; is selected, all time values are returned in UNIX epoch time in seconds. Please not that all time is then in GMT+0! For daily values with unix timestamp, please apply &#x60;utc_offset_seconds&#x60; again to get the correct date. | (optional) defaults to 'iso8601'
 **timezone** | [**string**] | If &#x60;timezone&#x60; is set, all timestamps are returned as local-time and data is returned starting at 0:00 local-time. Any time zone name from the [time zone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) is supported. | (optional) defaults to undefined
 **pastDays** | [**1 | 2**]**Array<1 &#124; 2>** | If &#x60;past_days&#x60; is set, yesterdays or the day before yesterdays data are also returned. | (optional) defaults to undefined
 **forecastDays** | [**number**] | Number of days for the forcast. If set to 1, only the current day is selected. | (optional) defaults to undefined


### Return type

**V1ForecastGet200Response**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | OK |  -  |
**400** | Bad Request |  -  |

[[Back to top]](#) [[Back to API list]](README.md#documentation-for-api-endpoints) [[Back to Model list]](README.md#documentation-for-models) [[Back to README]](README.md)


