import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = 'bd5e378503939ddaee76f12ad7a97608';

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.openweathermap.org/data/2.5/' }),
  endpoints: (builder) => ({
    getWeatherByCity: builder.query({
      query: (city: string) => `weather?q=${city}&appid=${API_KEY}&units=metric`,
    }),
  }),
});

export const { useGetWeatherByCityQuery } = weatherApi;
