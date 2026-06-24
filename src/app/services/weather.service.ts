import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  sys: {
    country: string;
  };
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = environment.openWeather.apiKey;
  private apiUrl = environment.openWeather.apiUrl;

  constructor(private http: HttpClient) {}

  getCurrentWeather(city: string): Observable<WeatherData> {
    return this.http.get<WeatherData>(
      `${this.apiUrl}/weather?q=${city}&appid=${this.apiKey}&units=imperial`
    );
  }

  getWeatherByCoords(lat: number, lon: number): Observable<WeatherData> {
    return this.http.get<WeatherData>(
      `${this.apiUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`
    );
  }

  getForecast(city: string): Observable<ForecastData> {
    return this.http.get<ForecastData>(
      `${this.apiUrl}/forecast?q=${city}&appid=${this.apiKey}&units=imperial`
    );
  }
}
