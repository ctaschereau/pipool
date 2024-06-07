// config.d.ts
declare module 'config' {
  const value: {
    port: number;
    tempServerUrl: string;
    cityIDForWeatherService: string;
    samplingIntervalCron: string;
    notificationIntervalInMs: number;
  };
  export default value;
}