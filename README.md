# Personal Dashboard

A modern full-stack dashboard application built with Angular 19 and Supabase, featuring complete authentication, beautiful UI with glassmorphism effects, and a responsive design.

![Angular](https://img.shields.io/badge/Angular-19-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)

## ✨ Features

- 🔐 **Complete Authentication System**
  - Email/Password sign up & login
  - Social auth ready (Google, GitHub, Apple)
  - Forgot password flow
  - JWT token management
  - Protected routes with auth guards
  
- 🎨 **Modern UI/UX**
  - Side-by-side login/signup layout
  - Liquid glass text effects
  - Dark gradient backgrounds
  - Smooth animations & transitions
  - Fully responsive design
  
- 🗄️ **Backend**
  - Supabase (PostgreSQL database)
  - Real-time auth state management
  - Secure API integration

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- [Angular CLI](https://angular.dev/cli) (v19)

```bash
npm install -g @angular/cli@19
```

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jwarburton97/personal-dashboard.git
   cd personal-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   - Go to [supabase.com](https://supabase.com) and create a free account
   - Create a new project
   - Get your API credentials:
     - Go to **Project Settings** → **API**
     - Copy your **Project URL**
     - Copy your **anon/public key** (from Legacy section)

4. **Configure environment**
   
   Update `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     supabase: {
       url: 'YOUR_SUPABASE_URL',
       key: 'YOUR_SUPABASE_ANON_KEY'
     }
   };
   ```
   
   Update `src/environments/environment.prod.ts` with the same values.

5. **Run the application**
   ```bash
   ng serve
   ```
   
   Navigate to `http://localhost:4200/`

## 📁 Project Structure

```
src/
├── app/
│   ├── auth.guard.ts              # Route protection
│   ├── dashboard/                 # Dashboard page
│   ├── login/                     # Login/signup page
│   ├── services/
│   │   └── auth.service.ts        # Authentication service
│   └── app.routes.ts              # Route configuration
├── environments/                  # Environment configs
└── styles.css                     # Global styles
```

## 🔑 Authentication Flow

1. **Sign Up**: Users create an account with email/password
2. **Email Confirmation**: Supabase sends verification email (configurable)
3. **Login**: Users sign in with credentials
4. **Dashboard Access**: Authenticated users see the dashboard
5. **Logout**: Users can sign out from the dashboard

## 🛠️ Tech Stack

- **Frontend**: Angular 19, TypeScript, CSS3
- **Backend**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (JWT tokens)
- **Styling**: Custom CSS with glassmorphism effects
- **Icons**: Font Awesome

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `ng serve` | Start development server at `http://localhost:4200` |
| `ng build` | Build for production to `dist/` |
| `ng test` | Run unit tests with Karma |
| `ng generate component <name>` | Generate a new component |

## 🎯 Roadmap

- [ ] User profile page
- [ ] Dashboard widgets (tasks, analytics, etc.)
- [ ] Dark/light mode toggle
- [ ] Email customization
- [ ] OAuth integration (Google, GitHub)
- [ ] User settings page

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Jonathan Warburton**
- GitHub: [@jwarburton97](https://github.com/jwarburton97)

## 🙏 Acknowledgments

- Built with [Angular](https://angular.dev/)
- Backend powered by [Supabase](https://supabase.com)
- Icons from [Font Awesome](https://fontawesome.com)
