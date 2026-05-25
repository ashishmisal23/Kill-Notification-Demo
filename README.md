# Kill-Notification-Demo

Concise, creation-only documentation for this interview submission. Contains a short feature list and important configuration notes — no usage or implementation walkthroughs.

## Features

- Kill Notifications toggle (per-device opt-out) — persisted flag: `NOTIFICATIONS_ENABLED`.
- FCM integration for device token lifecycle (register/unregister endpoints provided by the server).
- Local notifications via Notifee (skipped when notifications are disabled).

## Project structure

- `Kill-Notification-Mobile-App/` — React Native client (FCM + Notifee integrations).
- `Kill-Notification-Server-Backend/` — Express API (stores device tokens, sends FCM messages).

## Important configuration

- Firebase service account: place credentials in server config (see server `.env` / config directory).
- Database connection: configured via server `.env` (MongoDB URI or chosen DB).
- Mobile API base URL: set `BASE_URL` in `Kill-Notification-Mobile-App/src/services/api.ts` to point to the running backend.
- AsyncStorage gating key: `NOTIFICATIONS_ENABLED` (treat absence as enabled by default).

## Primary interfaces (high level)

- `POST /api/register-token` — register device FCM token (server).
- `POST /api/unregister-token` — remove device FCM token (server).
- `POST /api/send-notification` — send test/targeted notification (server).

## Notes

- This README is intentionally focused on features and essential configuration only. Implementation details and usage instructions are omitted per project submission requirements.
