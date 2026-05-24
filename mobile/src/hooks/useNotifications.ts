import { useEffect, useState } from 'react';

import messaging, {
  FirebaseMessagingTypes,
} from '@react-native-firebase/messaging';

import {
  createNotificationChannel,
  showLocalNotification,
} from '../utils/notificationService';

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
        console.log(
          'Foreground Notification:',
          remoteMessage,
        );

        addNotification(remoteMessage);

        // Floating Notification
        await showLocalNotification(
          remoteMessage.notification?.title ||
          'Notification',

          remoteMessage.notification?.body || '',
        );
      },
    );

    // Opened From Background
    messaging().onNotificationOpenedApp(
      (
        remoteMessage:
          | FirebaseMessagingTypes.RemoteMessage
          | null,
      ) => {
        if (remoteMessage) {
          console.log(
            'Opened From Background:',
            remoteMessage,
          );

          addNotification(remoteMessage);
        }
      },
    );

    // Opened From Quit State
    messaging()
      .getInitialNotification()
      .then(
        (
          remoteMessage:
            | FirebaseMessagingTypes.RemoteMessage
            | null,
        ) => {
          if (remoteMessage) {
            console.log(
              'Opened From Quit State:',
              remoteMessage,
            );

            addNotification(remoteMessage);
          }
        },
      );

    return unsubscribe;

  }, []);

  async function initializeNotifications() {
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
  };
};

export default useNotifications;
