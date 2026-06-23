import { Component } from '@angular/core'
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink, FormsModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    email: string = '';
    password: string = '';
    showSignupForm: boolean = false;

    onLogin() {
        console.log('Email: ', this.email);
        console.log('Password: ', this.password);
    }

    toggleSignupForm() {
        this.showSignupForm = !this.showSignupForm;
    }
}
