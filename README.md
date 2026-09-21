Yuwani
# JobLink LK — React Native App

This is the **frontend only** (React Native / Expo, TypeScript). It expects a
Laravel API (Sanctum auth) at the URL configured in `app.json → expo.extra.apiBaseUrl`.

## Setup

```bash
npm install
npx expo start
```

Update the API URL for your environment in `app.json`:
```json
"extra": { "apiBaseUrl": "https://your-api.example.com/api/v1" }
```

## Project structure

```
App.tsx
src/
 ├── api/            axios client + one file per resource (auth, jobs, messages)
 ├── navigation/      RootNavigator (auth stack ⇄ main tabs)
 ├── screens/         Auth, Jobs, Messages, Profile
 ├── store/           zustand auth store
 ├── components/      shared UI (JobCard, etc.)
 ├── theme/           colors, spacing, radius
 └── types/           shared TS interfaces
```

## Security notes (App Store / Play Store review)

- **Auth tokens** are stored with `expo-secure-store` (iOS Keychain / Android
  Keystore), never in `AsyncStorage` or JS state that could leak via backups
  or a compromised device.
- **HTTPS only** — `app.json` sets `android.usesCleartextTraffic: false`.
- **401 handling** — a global response interceptor in `src/api/client.ts`
  clears the token and signs the user out automatically on an expired/invalid
  session, so the app never displays private data with a dead token.
- **Permissions** — `Info.plist` / Android manifest entries in `app.json`
  include human-readable purpose strings for location/camera, required by
  Apple review.
- **No secrets in the bundle** — the API base URL is the only config baked
  into the client; nothing else sensitive (API keys, admin tokens) should
  ever be added here, since RN JS bundles can be unpacked.
- **Chat messages** render as plain `<Text>`, never as HTML, to avoid markup/
  script injection from another user's input.
- All server-side validation, authorization and rate limiting must live in
  the Laravel API — client-side checks here are for UX only and are never a
  substitute for backend enforcement.

## Still to wire up before shipping

- Push notifications (Expo Notifications + Laravel backend trigger)
- Image upload for profile photo / job photos (presigned S3 URL flow)
- Real pagination on job list / messages
- Biometric unlock (optional, via `expo-local-authentication`)

## Troubleshooting

**`_ExpoFontLoader.default.getLoadedFonts is not a function`**
This means the `expo` SDK version in `package.json` doesn't match the Expo
Go app installed on your phone (Expo Go only ever runs the *latest* SDK).
Fix it with:

```bash
npm install
npx expo install --fix
```

`expo install --fix` rewrites every Expo-managed package in `package.json`
to the exact version that matches your installed `expo` version, which is
what resolves native/JS API mismatches like this one. Re-run
`npx expo start --tunnel` afterwards.

# JobLink LK – Mobile App

A React Native mobile application for connecting job seekers (workers) with employers in Sri Lanka.

## Project Overview

This repository contains the **frontend/mobile application** for JobLink LK.

The UI is designed around two main user roles:

- 👷 **Worker** – browse/search for available jobs and manage job-related activity.
- 🏢 **Employer** – access employer functionality and manage job postings/recruitment.

> **Frontend stack:** React Native

## UI Reference

The implementation should follow the provided JobLink LK UI reference, including:

- Splash screen / app launch
- Login screen
- Phone number + password authentication
- Forgot password flow
- Worker demo / Employer demo entry points
- Sign-up flow
- Worker job dashboard
- Job search/filter interface
- Job listing cards
- Bottom navigation
- Job/application related screens

## Technology

- React Native
- JavaScript / TypeScript
- React Navigation
- REST API integration (backend to be connected)
- Git / GitHub

## Suggested Project Structure

```text
JobLink-LK/
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   ├── components/
│   ├── screens/
│   │   ├── auth/
│   │   ├── worker/
│   │   └── employer/
│   ├── navigation/
│   ├── services/
│   ├── hooks/
│   ├── utils/
│   ├── constants/
│   └── theme/
├── App.tsx
├── package.json
├── README.md
└── ...
```

## Getting Started

### 1. Clone the repository

```bash
git clone <REPOSITORY_URL>
cd JobLink-LK
```

### 2. Install dependencies

```bash
npm install
```

or

```bash
yarn install
```

### 3. Start the Metro bundler

```bash
npm start
```

### 4. Run on Android

```bash
npm run android
```

### 5. Run on iOS

```bash
npm run ios
```

> For iOS development, CocoaPods and a macOS/Xcode environment are required.

## Development Guidelines

### Components

Create reusable components for common UI elements such as:

- Buttons
- Input fields
- Job cards
- Search bars
- Headers
- Bottom navigation
- Modals
- Loading indicators

### Styling

Keep the UI consistent with the Figma/reference design.

Recommended approach:

- Centralize colors in `src/theme/`
- Centralize typography and spacing
- Avoid hard-coded repeated values
- Make components reusable across Worker and Employer screens

### Navigation

Keep authentication and application navigation separated.

Example:

```text
App
├── Auth Stack
│   ├── Splash
│   ├── Login
│   ├── Sign Up
│   └── Forgot Password
│
└── Main App
    ├── Worker
    │   ├── Home
    │   ├── Search
    │   ├── Applications
    │   └── Profile
    │
    └── Employer
        ├── Dashboard
        ├── Jobs
        ├── Applications
        └── Profile
```

## API Integration

The frontend will consume the backend API for:

- Authentication
- User registration
- User profile data
- Job listings
- Job search/filtering
- Job applications
- Employer job management

Keep API-related logic inside:

```text
src/services/
```

Example:

```text
src/services/
├── api.ts
├── authService.ts
├── jobService.ts
└── userService.ts
```

Do not place API calls directly inside UI components unless there is a specific reason.

## Environment Variables

Keep environment-specific values outside the source code.

Example:

```env
API_BASE_URL=https://your-api-url.com
```

Do **not** commit secrets, API keys, passwords, or private tokens to GitHub.

## Git Workflow

Use feature branches for development.

Example:

```bash
git checkout -b feature/login-screen
```

After completing the work:

```bash
git add .
git commit -m "feat: implement login screen"
git push origin feature/login-screen
```

### Suggested Commit Format

```text
feat: add job search screen
fix: fix login validation
style: update job card UI
refactor: improve navigation structure
chore: update dependencies
docs: update README
```

## Frontend Responsibilities

The frontend developer is responsible for:

- Implementing the UI from the approved design
- Responsive mobile layouts
- Navigation
- Form validation
- Loading/error/empty states
- API integration
- Authentication state handling
- Reusable components
- Maintaining clean and readable code

## Current Priority

### Phase 1 – UI

- [ ] Project setup
- [ ] Theme/colors/typography
- [ ] Splash screen
- [ ] Login screen
- [ ] Sign-up screen
- [ ] Forgot password screen
- [ ] Worker dashboard
- [ ] Job listing/search UI
- [ ] Job details
- [ ] Application UI
- [ ] Profile UI
- [ ] Employer screens

### Phase 2 – Integration

- [ ] Connect authentication API
- [ ] Connect job listing API
- [ ] Connect search/filter API
- [ ] Connect application API
- [ ] Connect profile API
- [ ] Handle API loading/error states

### Phase 3 – Testing & Polish

- [ ] Test Android
- [ ] Test iOS
- [ ] Test navigation
- [ ] Test form validation
- [ ] Test API error states
- [ ] UI polish against Figma
- [ ] Final bug fixing

## Notes

The UI should be treated as the source of truth for visual implementation. Backend/API details can be integrated after the relevant endpoints are available.

---

## Team

**Project:** JobLink LK  
**Platform:** Mobile  
**Frontend:** React Native  
**Repository:** GitHub
main
