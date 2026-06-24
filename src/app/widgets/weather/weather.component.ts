import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService, WeatherData } from '../../services/weather.service';

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent implements OnInit {
  weather: WeatherData | null = null;
  loading = true;
  error = '';
  city = 'New York'; // Default city

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.loadWeather();
  }

  loadWeather() {
    this.loading = true;
    this.error = '';

    this.weatherService.getCurrentWeather(this.city).subscribe({
      next: (data) => {
        this.weather = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load weather data';
        this.loading = false;
        console.error('Weather error:', err);
      }
    });
  }

  getWeatherIcon(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }

  refreshWeather() {
    this.loadWeather();
  }
}
