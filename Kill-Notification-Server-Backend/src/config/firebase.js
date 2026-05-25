const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

function initFirebase() {
  if (admin.apps.length) return admin.app();

  const credPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  const credJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  let credential;

  // Try JSON environment variable first
  if (credJson) {
    try {
      const parsed = JSON.parse(credJson);
      credential = admin.credential.cert(parsed);
      admin.initializeApp({ credential });
      console.log('Firebase Admin initialized (from JSON)');
      return admin;
    } catch (err) {
      console.error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON:', err.message);
    }
  }

  // Try file path
  if (credPath) {
    try {
      const fullPath = path.isAbsolute(credPath) ? credPath : path.join(process.cwd(), credPath);
      if (fs.existsSync(fullPath)) {
        const keyFile = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        credential = admin.credential.cert(keyFile);
        admin.initializeApp({ credential });
        console.log('Firebase Admin initialized (from file)');
        return admin;
      }
    } catch (err) {
      console.warn('Failed to load Firebase credentials from file:', err.message);
    }
  }

  // Try default credentials
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
      credential = admin.credential.applicationDefault();
      admin.initializeApp({ credential });
      console.log('Firebase Admin initialized (from default credentials)');
      return admin;
    } catch (err) {
      console.warn('Failed to load default Firebase credentials:', err.message);
    }
  }

  // Initialize without credentials for dev/testing
  console.warn('\n⚠️  No Firebase credentials configured. Notifications will NOT work.');
  console.warn('To enable notifications, set FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT_JSON in .env\n');
  admin.initializeApp();
  return admin;
}

module.exports = initFirebase;
