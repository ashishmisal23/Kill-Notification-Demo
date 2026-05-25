import { useEffect, useState } from 'react';

import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  createNotificationChannel,
  showLocalNotification,
} from '../utils/notificationService';
import { registerTokenApi, unregisterTokenApi } from '../services/api';

const STORAGE_KEY = 'NOTIFICATIONS_ENABLED';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  data?: { [key: string]: string };
}

const useNotifications = () => {
  const [token, setToken] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<
    NotificationItem[]

  >([]);

  useEffect(() => {
    initializeNotifications();

    // Foreground Notifications
    const unsubscribe = messaging().onMessage(
      async (
        remoteMessage: FirebaseMessagingTypes.RemoteMessage,
      ) => {
        console.log('Foreground Notification:', remoteMessage);

        try {
          const enabled = await AsyncStorage.getItem(STORAGE_KEY);
          if (enabled === 'false') return; // skip when disabled
        } catch (e) {
          // ignore storage read errors and proceed
        }

        addNotification(remoteMessage);

        // Floating Notification
        await showLocalNotification(
          remoteMessage.notification?.title || 'Notification',
          remoteMessage.notification?.body || '',
        );
      },
    );

    // Opened From Background
    messaging().onNotificationOpenedApp(
      async (
        remoteMessage:
          | FirebaseMessagingTypes.RemoteMessage
          | null,
      ) => {
        if (remoteMessage) {
          try {
            const enabled = await AsyncStorage.getItem(STORAGE_KEY);
            if (enabled === 'false') return;
          } catch (e) {}

          console.log('Opened From Background:', remoteMessage);

          addNotification(remoteMessage);
        }
      },
    );

    // Opened From Quit State
    messaging()
      .getInitialNotification()
      .then(async (
        remoteMessage:
          | FirebaseMessagingTypes.RemoteMessage
          | null,
      ) => {
        if (remoteMessage) {
          try {
            const enabled = await AsyncStorage.getItem(STORAGE_KEY);
            if (enabled === 'false') return;
          } catch (e) {}

          console.log('Opened From Quit State:', remoteMessage);

          addNotification(remoteMessage);
        }
      });

    return unsubscribe;

  }, []);

  async function initializeNotifications() {
    try {
      const enabled = await AsyncStorage.getItem(STORAGE_KEY);
      if (enabled === 'false') {
        console.log('Notifications disabled - skipping init');
        return;
      }
    } catch (e) {
      // ignore
    }

    await createNotificationChannel();

    await requestUserPermission();

    await getFCMToken();

  }

  async function requestUserPermission() {
    try {
      const authStatus =
        await messaging().requestPermission();
      const enabled =
        authStatus ===
        messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus ===
        messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log(
          'Notification Permission Granted',
        );
      }
    } catch (error) {
      console.log(
        'Notification Permission Error:',
        error,
      );
    }

  }

  async function getFCMToken() {
    try {
      const fcmToken = await messaging().getToken();

      console.log('FCM TOKEN:', fcmToken);

      setToken(fcmToken);
    } catch (error) {
      console.log('FCM TOKEN ERROR:', error);
    }

  }

  // Refresh token manually and register with backend
  async function refreshToken(platform?: string) {
    try {
      await requestUserPermission();
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        setToken(fcmToken);
        try {
          await registerTokenApi(fcmToken, platform);
        } catch (e) {
          console.warn('registerTokenApi failed', e);
        }
      }
    } catch (e) {
      console.warn('refreshToken error', e);
      throw e;
    }
  }

  // Clear token locally and unregister from backend
  async function clearToken() {
    try {
      const current = token;
      if (current) {
        try {
          await unregisterTokenApi(current);
        } catch (e) {
          console.warn('unregisterTokenApi failed', e);
        }
      }

      try {
        await messaging().deleteToken();
      } catch (e) {
        console.warn('messaging.deleteToken failed', e);
      }

      setToken(null);
    } catch (e) {
      console.warn('clearToken error', e);
      throw e;
    }
  }

  function addNotification(
    remoteMessage: FirebaseMessagingTypes.RemoteMessage,
  ) {
    const notification: NotificationItem = {
      id: Date.now().toString(),

      title:
        remoteMessage.notification?.title ||
        'No Title',

      body:
        remoteMessage.notification?.body ||
        'No Body',

      data: remoteMessage.data,
    };

    setNotifications(prev => [
      notification,
      ...prev,
    ]);

  }

  return {
    token,
    notifications,
    refreshToken,
    clearToken,
  };
};

export default useNotifications;
