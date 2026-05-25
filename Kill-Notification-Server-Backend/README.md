# NotificationBackend

Backend service for the NotificationDemo React Native app. Provides REST endpoints to register device tokens and send push notifications using Firebase Cloud Messaging (FCM).

Features

- Register device tokens and persist in MongoDB
- Send notification to single device or all registered devices
- Topic-based sends
- Simple, beginner-friendly structure with async/await and error handling
- Docker-ready

Tech stack

- Node.js + Express
- Firebase Admin SDK (FCM)
- MongoDB (optional)
- dotenv, cors, morgan

Quick start

1. Copy the example env: `cp .env.example .env` and edit values.
2. Place your Firebase service account JSON at the path referenced by `FIREBASE_SERVICE_ACCOUNT_PATH`, or set `FIREBASE_SERVICE_ACCOUNT_JSON`.
3. (Optional) Start a local MongoDB instance or change `MONGODB_URI`.
4. Install dependencies:

```bash
npm install
```

5. Run in development:

```bash
npm run dev
```

Firebase setup

1. Go to the Firebase Console → Project Settings → Service Accounts.
2. Generate a new private key and download the JSON file.
3. Either set `FIREBASE_SERVICE_ACCOUNT_PATH` to the file path (recommended for development), or copy the JSON into `FIREBASE_SERVICE_ACCOUNT_JSON` (for CI use with protected secrets).
4. For production, prefer setting `GOOGLE_APPLICATION_CREDENTIALS` or use managed secrets.

API endpoints

- POST `/api/register-token` — body: `{ token: string, platform?: 'android'|'ios' }`
- POST `/api/send-notification` — body: `{ token, title, body, image?, data? }`
- POST `/api/send-to-all` — body: `{ title, body, image?, data? }`
- POST `/api/send-to-topic` — body: `{ topic, title, body, image?, data? }`

Example curl

Register token:

```bash
curl -X POST http://localhost:4000/api/register-token \
  -H 'Content-Type: application/json' \
  -d '{"token":"YOUR_FCM_TOKEN","platform":"android"}'
```

Send to single token:

```bash
curl -X POST http://localhost:4000/api/send-notification \
  -H 'Content-Type: application/json' \
  -d '{"token":"YOUR_FCM_TOKEN","title":"Hello","body":"Test message"}'
```

Send to all registered tokens:

```bash
curl -X POST http://localhost:4000/api/send-to-all \
  -H 'Content-Type: application/json' \
  -d '{"title":"Broadcast","body":"This goes to everyone"}'
```

Postman

Import the above endpoints as POST requests, set `Content-Type: application/json`, and supply the JSON body.

Production notes

- Use `NODE_ENV=production` and a process manager (PM2) or container orchestration.
- Use secure secret management for Firebase credentials and MongoDB URI.
- Consider adding rate-limiting, authentication, and monitoring (Sentry, Prometheus).

Bonus & suggestions

- Topic-based notifications are supported via `/api/send-to-topic`.
- For scheduled notifications, implement a job queue (BullMQ or agenda) and trigger sends at scheduled times.
- Dockerfile and docker-compose are provided for convenience.
