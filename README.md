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
