import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink, FormsModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    // Login fields
    loginEmail: string = '';
    loginPassword: string = '';

    // Signup fields
    signupFirstName: string = '';
    signupLastName: string = '';
    signupEmail: string = '';
    signupPassword: string = '';

    showSignupForm: boolean = false;
    showForgotPassword: boolean = false;
    forgotPasswordEmail: string = '';
    errorMessage: string = '';
    successMessage: string = '';
    loading: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    async onLogin() {
        this.errorMessage = '';
        this.loading = true;

        try {
            await this.authService.signIn(this.loginEmail, this.loginPassword);
            this.successMessage = 'Login successful!';
            this.router.navigate(['/dashboard']);
            console.log('Login successful!', this.authService.currentUserValue);
        } catch (error: any) {
            this.errorMessage = error.message || 'Login failed. Please try again.';
            console.error('Login error:', error);
        } finally {
            this.loading = false;
        }
    }

    async onSignup() {
        console.log('onSignup called!');
        console.log('Email:', this.signupEmail);
        console.log('Password:', this.signupPassword);
        console.log('First Name:', this.signupFirstName);
        console.log('Last Name:', this.signupLastName);

        this.errorMessage = '';
        this.loading = true;

        try {
            await this.authService.signUp(
                this.signupEmail,
                this.signupPassword,
                this.signupFirstName,
                this.signupLastName
            );
            this.successMessage = 'Account created! Please check your email to verify.';
            // Clear form
            this.signupFirstName = '';
            this.signupLastName = '';
            this.signupEmail = '';
            this.signupPassword = '';
        } catch (error: any) {
            this.errorMessage = error.message || 'Signup failed. Please try again.';
            console.error('Signup error:', error);
        } finally {
            this.loading = false;
        }
    }

    async signInWithGoogle() {
        try {
            await this.authService.signInWithGoogle();
        } catch (error: any) {
            this.errorMessage = error.message || 'Google sign-in failed.';
            console.error('Google sign-in error:', error);
        }
    }

    async signInWithGithub() {
        try {
            await this.authService.signInWithGithub();
        } catch (error: any) {
            this.errorMessage = error.message || 'GitHub sign-in failed.';
            console.error('GitHub sign-in error:', error);
        }
    }

    async signInWithApple() {
        // Apple sign-in requires additional setup in Supabase
        this.errorMessage = 'Apple sign-in coming soon!';
    }

    toggleSignupForm() {
        this.showSignupForm = !this.showSignupForm;
        this.showForgotPassword = false;
        this.errorMessage = '';
        this.successMessage = '';
    }

    toggleForgotPassword() {
        this.showForgotPassword = !this.showForgotPassword;
        this.errorMessage = '';
        this.successMessage = '';
    }

    async onForgotPassword() {
        if (!this.forgotPasswordEmail) {
            this.errorMessage = 'Please enter your email address.';
            return;
        }

        this.errorMessage = '';
        this.loading = true;

        try {
            await this.authService.resetPassword(this.forgotPasswordEmail);
            this.successMessage = 'Password reset email sent! Check your inbox.';
            this.forgotPasswordEmail = '';
            setTimeout(() => {
                this.showForgotPassword = false;
                this.successMessage = '';
            }, 3000);
        } catch (error: any) {
            this.errorMessage = error.message || 'Failed to send reset email.';
            console.error('Password reset error:', error);
        } finally {
            this.loading = false;
        }
    }
}
