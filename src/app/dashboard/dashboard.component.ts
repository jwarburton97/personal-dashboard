import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '@supabase/supabase-js';
import { WeatherComponent } from '../widgets/weather/weather.component';
import { StocksComponent } from '../widgets/stocks/stocks.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, WeatherComponent, StocksComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  user: User | null = null;
  firstName: string = '';
  lastName: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.currentUserValue;

    if (this.user) {
      // Get user metadata (first name, last name from signup)
      this.firstName = this.user.user_metadata?.['first_name'] || '';
      this.lastName = this.user.user_metadata?.['last_name'] || '';
    }
  }

  async logout() {
    try {
      await this.authService.signOut();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}
