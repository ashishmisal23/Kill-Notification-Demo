/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { StatusBar, useColorScheme, PermissionsAndroid, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import useNotifications from './src/hooks/useNotifications';
import installations from '@react-native-firebase/installations';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  // initialize notifications hook (sets up listeners and token)
  useNotifications();

  useEffect(() => {
    // Request Android 13+ notification permission
    async function requestPermission() {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        try {
          await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
        } catch (err) {
          console.warn('Notification permission request failed', err);
        }
      }
    }

    async function getFirebaseInstallationId() {
      try {
        const fid = await installations().getId();
        console.log('Firebase Installation ID:', fid);
      } catch (err) {
        console.warn('Installations getId error:', err);
      }
    }

    requestPermission();
    getFirebaseInstallationId();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;