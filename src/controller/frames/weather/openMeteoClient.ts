import * as openMeteo from "./open-meteo-client";

// Covers all auth methods included in your OpenAPI yaml definition
const authConfig: openMeteo.AuthMethodsConfiguration = {};

// Implements a simple middleware to modify requests before (`pre`) they are sent
// and after (`post`) they have been received
class Test implements openMeteo.Middleware {
    pre(context: openMeteo.RequestContext): Promise<openMeteo.RequestContext> {
        // Modify context here and return
        return Promise.resolve(context);
    }

    post(context: openMeteo.ResponseContext): Promise<openMeteo.ResponseContext> {
        return Promise.resolve(context);
    }
}

// Create configuration parameter object
const configurationParameters = {
    baseServer: new openMeteo.ServerConfiguration<NonNullable<unknown>>("https://api.open-meteo.com", {}),
    authMethods: authConfig, // No auth is default
    promiseMiddleware: [new Test()],
};

// Convert to actual configuration
const config = openMeteo.createConfiguration(configurationParameters);

export const weatherForecastAPI = new openMeteo.WeatherForecastAPIsApi(config);
