/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';

import { NewAppScreen } from '@react-native/new-app-screen';

import {
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import messaging from '@react-native-firebase/messaging';

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    requestNotificationPermission();

    getFcmToken();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Foreground Notification:', remoteMessage);
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification opened from background state:',
        remoteMessage,
      );
    });

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification opened from killed state:',
            remoteMessage,
          );
        }
      });

    return unsubscribe;
  }, []);

  async function requestNotificationPermission() {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );

        console.log('Notification Permission:', granted);
      } catch (error) {
        console.log('Permission Error:', error);
      }
    }
  }

  async function getFcmToken() {
    try {
      const token = await messaging().getToken();

      console.log('FCM TOKEN:', token);
    } catch (error) {
      console.log('FCM TOKEN ERROR:', error);
    }
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;