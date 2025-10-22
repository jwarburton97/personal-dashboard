import { Component } from '@angular/core'
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    email: string = '';
    password: string = '';

    onLogin() {
        console.log('Email: ', this.email);
        console.log('Password: ', this.password);
    }
}
