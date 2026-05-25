const initFirebase = require('../config/firebase');

function getMessaging() {
  const admin = initFirebase();

  if (!admin.messaging) {
    throw new Error(
      'Firebase messaging not available. Please configure Firebase credentials in .env',
    );
  }

  return admin.messaging();
}

/**

Send notification to single device
*/
async function sendToToken(
  token,
  payload,
  options = {},
) {
  try {
    const messaging = getMessaging();

    const message = {
      token,

      notification: {
        title:
          payload.notification?.title || '',
        body:
          payload.notification?.body || '',
      },

      data: payload.data || {},

      android: {
        priority: 'high',

        notification: {
          channelId: 'default',

          sound: 'default',

          priority: 'high',

          visibility: 'public',

          defaultSound: true,

          defaultVibrateTimings: true,
        },

      },

      apns: {
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },

      ...options,
    };

    return await messaging.send(message);
  } catch (err) {
    console.error(
      'Error sending to token:',
      err.message,
    );

    throw err;
  }
}

/**

Send notification to multiple devices
*/
async function sendToTokens(
  tokens,
  payload,
  options = {},
) {
  try {
    const messaging = getMessaging();

    const message = {
      tokens,

      notification: {
        title:
          payload.notification?.title || '',
        body:
          payload.notification?.body || '',
      },

      data: payload.data || {},

      android: {
        priority: 'high',

        notification: {
          channelId: 'default',

          sound: 'default',

          priority: 'high',
        },

      },

      apns: {
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },

      ...options,
    };

    return await messaging.sendEachForMulticast(
      message,
    );
  } catch (err) {
    console.error(
      'Error sending to tokens:',
      err.message,
    );

    throw err;
  }
}

/**

Send notification to topic
*/
async function sendToTopic(
  topic,
  payload,
  options = {},
) {
  try {
    const messaging = getMessaging();

    const message = {
      topic,

      notification: {
        title:
          payload.notification?.title || '',
        body:
          payload.notification?.body || '',
      },

      data: payload.data || {},

      android: {
        priority: 'high',

        notification: {
          channelId: 'default',

          sound: 'default',

          priority: 'high',
        },

      },

      apns: {
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },

      ...options,
    };

    return await messaging.send(message);
  } catch (err) {
    console.error(
      'Error sending to topic:',
      err.message,
    );

    throw err;
  }
}

module.exports = {
  sendToToken,
  sendToTokens,
  sendToTopic,
};