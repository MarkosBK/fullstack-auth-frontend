# Fullstack Auth Frontend

A modern React Native mobile application built with Expo, featuring comprehensive authentication, internationalization, and a clean architecture.

## 🚀 Tech Stack

- **Framework**: React Native with Expo SDK 53
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: Expo Router (file-based routing)
- **State Management**: TanStack Query (React Query)
- **Authentication**: JWT with refresh tokens
- **API Client**: Axios with automatic token refresh
- **Form Handling**: React Hook Form with Zod validation
- **Internationalization**: i18next with react-i18next
- **Code Generation**: Orval (OpenAPI/Swagger to TypeScript)
- **Development**: ESLint, Prettier, TypeScript

## 📱 Features

- **Authentication System**

  - User registration with email verification
  - Login/logout functionality
  - Password reset with OTP verification
  - JWT token management with automatic refresh
  - Route protection based on authentication status

- **User Interface**

  - Dark/Light theme support
  - Responsive design with NativeWind
  - Custom tab bar navigation
  - Keyboard-aware scrolling
  - Haptic feedback integration
  - Splash screen with animations

- **Internationalization**

  - Multi-language support (English, German)
  - Dynamic language switching
  - Localized content and UI elements

- **Developer Experience**
  - Type-safe API client with auto-generated types
  - Hot reloading and fast refresh
  - Comprehensive error handling
  - Code formatting and linting

## 🛠️ Prerequisites

- Node.js 24.7.0
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Create .env file
EXPO_PUBLIC_API_URL=http://localhost:4000
```

4. Generate API types (if backend is running):

```bash
npm run generate:api
```

## 🚀 Development

### Start the development server:

```bash
npm start
```

### Run on specific platforms:

```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

### Code quality:

```bash
# Lint and format code
npm run format

# Check code quality
npm run lint
```

## 📁 Project Structure

```
├── app/                    # Expo Router pages
│   ├── (app)/             # Protected routes
│   ├── (auth)/            # Authentication routes
│   └── select-language/   # Language selection modal
├── components/            # Reusable UI components
│   ├── common/           # Common components (buttons, inputs, etc.)
│   ├── tab-bar/          # Custom tab bar
│   └── theme-toggle/     # Theme switching component
├── lib/                   # Core utilities and configurations
│   ├── api/              # API client and generated types
│   ├── guards/           # Route protection logic
│   ├── hooks/            # Custom React hooks
│   └── utils/            # Utility functions
├── providers/            # React context providers
├── screens/              # Screen components
├── styles/               # Global styles and themes
└── i18n/                 # Internationalization setup
```

## 🔧 Configuration

### API Configuration

The app connects to a backend API. Configure the API URL in your environment variables:

```bash
EXPO_PUBLIC_API_URL=http://your-api-url:port
```

### Theme Configuration

Themes are configured in `styles/color-theme.ts` and support both light and dark modes.

### Internationalization

Languages are configured in `i18n/locales/` with support for:

- English (en-US)
- German (de-DE)

## 🔐 Authentication Flow

1. **Registration**: User signs up → Email verification → Account activation
2. **Login**: Email/password → JWT tokens → Access to protected routes
3. **Password Reset**: Email request → OTP verification → New password
4. **Token Refresh**: Automatic refresh of expired access tokens

## 📱 Platform Support

- **iOS**: Native iOS app with custom splash screen
- **Android**: Native Android app with adaptive icons
- **Web**: Progressive web app support

## 🚀 Deployment

### Build for production:

```bash
# Prebuild native projects
npm run prebuild

# Build for iOS
npm run ios:device

# Build for Android
expo build:android
```

### Environment setup:

Ensure your production API URL is configured in the environment variables before building.

## 🤝 Contributing

1. Follow the existing code style and patterns
2. Use TypeScript for all new code
3. Add proper error handling
4. Update documentation as needed
5. Test on both iOS and Android platforms

## 📄 License

This project is private and proprietary.

## 🔗 Related Projects

This frontend application is part of a fullstack authentication system. It works in conjunction with:

- Backend API server
- Database system
- Authentication service

---

Built with ❤️ using React Native and Expo
