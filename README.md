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
