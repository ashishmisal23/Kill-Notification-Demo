# Kill-Notification-Demo

This repository is an interview submission implementing a "Kill Notifications" feature for a React Native app using Firebase Cloud Messaging (FCM) and Notifee. It includes a mobile client and a small Express backend that stores device tokens and sends FCM messages.

## Summary of the task

- Add a toggle to let users disable (kill) notifications for a device.
- Persist the toggle with AsyncStorage (`NOTIFICATIONS_ENABLED`).
- When disabled: prevent local notifications, stop persisting incoming messages, unregister device token on the backend, and delete the local FCM token.
- When enabled: request permissions, obtain/register FCM token and resume notifications.

## Project layout

- `Kill-Notification-Mobile-App/` — React Native mobile application (client)
- `Kill-Notification-Server-Backend/` — Express backend (server)

## Key implementation notes

- AsyncStorage key: `NOTIFICATIONS_ENABLED` (default: enabled — i.e. absence treated as enabled).
- Toggle UI: `Enable Notifications` Switch on the Home screen.
- Token lifecycle: app calls `POST /api/register-token` to register and `POST /api/unregister-token` to remove tokens.
- Local notifications (Notifee) and channel creation are skipped when notifications are disabled.

## Primary files changed

### Mobile (client)
- `Kill-Notification-Mobile-App/src/screens/HomeScreen.tsx` — added `Enable Notifications` switch, AsyncStorage persistence, loading and error handling for toggle.
- `Kill-Notification-Mobile-App/src/hooks/useNotifications.ts` — checks `NOTIFICATIONS_ENABLED`, gates foreground/background handlers, exposes `refreshToken()` and `clearToken()` helpers used by the screen.
- `Kill-Notification-Mobile-App/src/utils/notificationService.ts` — checks `NOTIFICATIONS_ENABLED` before creating channels or showing local Notifee notifications.
- `Kill-Notification-Mobile-App/src/services/api.ts` — added `unregisterTokenApi(token)`.

### Backend (server)
- `Kill-Notification-Server-Backend/src/controllers/notificationController.js` — added `unregisterToken` controller that removes tokens from the database.
- `Kill-Notification-Server-Backend/src/routes/notificationRoutes.js` — added `POST /api/unregister-token` route.

## How to run (quick)

1) Backend

```bash
cd Kill-Notification-Server-Backend
npm install
# configure .env with Firebase credentials and DB URL (see .env.example)
npm run start
```

2) Mobile (development)

```bash
cd Kill-Notification-Mobile-App
npm install
```

- iOS: install CocoaPods then run

```bash
cd ios
pod install --repo-update
cd ..
npx react-native run-ios
```

- Android: clean & run

```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

Important: set the backend URL in `Kill-Notification-Mobile-App/src/services/api.ts` `BASE_URL` so the mobile app can reach the server (examples and comments are inside that file).

## Testing / verification checklist (interviewer-friendly)

1. Default state
   - Fresh install: notifications are enabled by default.
2. Disable flow
   - On Home screen tap the `Enable Notifications` switch to OFF.
   - App should call the backend `POST /api/unregister-token` and show confirmation.
   - App should call `messaging().deleteToken()` (best-effort) and clear local token.
   - Incoming foreground messages should not show Notifee local notifications and should not be added to the in-app list.
3. Re-enable flow
   - Toggle the switch to ON.
   - App should request notification permission if needed, obtain a new FCM token, and call `POST /api/register-token`.
   - Notifications should resume normally.
4. End-to-end
   - Use `POST /api/send-notification` to target the registered token and confirm delivery when enabled, and confirm the backend no longer holds the token when disabled.

## Notes and troubleshooting

- If you see `NativeModule: AsyncStorage is null`:
  - Ensure `@react-native-async-storage/async-storage` is listed in `dependencies` and not only in lockfile.
  - Reinstall node modules, run `pod install` (iOS), rebuild the app, and clear Metro cache (`npx react-native start --reset-cache`).
- Network: remember emulator vs device differences when setting `BASE_URL`:
  - Android emulator: use `http://10.0.2.2:4000` (example)
  - iOS simulator: `http://localhost:4000`
  - Physical device: use machine IP: `http://192.168.x.y:4000`

## Interview evaluation checklist (suggested)

- Proper separation of concerns (hook for notifications, service for local notifications, API client for server calls) — check.
- Robustness: AsyncStorage gating, try/catch around token deletion & register — check.
- Minimal UI: Switch with loading and error handling — check.
- Backend change: new `unregister-token` route; DB deletion handled safely — check.

## Next steps (optional)

- Rename project folders to `mobile` / `NotificationBackend`, or create symlinks, if your CI/grader expects the original paths.
- I can open a PR with these changes and a short summary for the interviewer if you want.

Good luck with your interview — tell me if you'd like a concise submission summary to paste into your interview message or a PR-ready commit message.
