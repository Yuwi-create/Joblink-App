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
