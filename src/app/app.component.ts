import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component'; // <- Import it

@Component({
  selector: 'app-root',
  imports: [LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'personal-dashboard';
}
