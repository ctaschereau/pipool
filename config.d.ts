// config.d.ts
declare module 'config' {
  const value: {
    port: number;
    tempServerUrl: string;
    cityIDForWeatherService: string;
    weatherPageUrl: string;
    samplingIntervalCron: string;
    logLevel: string;
  };
  export default value;
}