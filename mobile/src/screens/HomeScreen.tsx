import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Clipboard, Alert, ScrollView, Switch } from 'react-native';
import AppButton from '../components/AppButton';
import AppInput from '../components/AppInput';
import useNotifications from '../hooks/useNotifications';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { registerTokenApi } from '../services/api';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { token, refreshToken, clearToken } = useNotifications() as any;
  const [loading, setLoading] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);
  const NOTIF_KEY = 'NOTIFICATIONS_ENABLED';

  useEffect(() => {
    // load persisted toggle
    (async () => {
      try {
        const val = await (await import('@react-native-async-storage/async-storage')).default.getItem(NOTIF_KEY);
        if (val === 'false') setNotifEnabled(false);
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const copyToken = async () => {
    try {
      await Clipboard.setString(token || '');
      Alert.alert('Copied', 'Token copied to clipboard');
    } catch (err) {
      Alert.alert('Copy failed', 'Could not copy token');
    }
  };

  async function handleRegister() {
    if (!token) return Alert.alert('No token', 'FCM token not available');
    setLoading(true);
    try {
      await registerTokenApi(token, 'android');
      Alert.alert('Registered', 'Token registered with backend');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  }

  async function toggleNotifications(enabled: boolean) {
    setToggleLoading(true);
    try {
      const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
      if (!enabled) {
        // disabling: unregister and delete token
        if (token) {
          try {
            await clearToken();
          } catch (e) {
            console.warn('clearToken error', e);
          }
        }

        await AsyncStorage.setItem(NOTIF_KEY, 'false');
        setNotifEnabled(false);
        Alert.alert('Notifications disabled');
      } else {
        // enabling: request token and register
        await AsyncStorage.setItem(NOTIF_KEY, 'true');
        try {
          await refreshToken('android');
        } catch (e) {
          console.warn('refreshToken failed', e);
          throw e;
        }
        setNotifEnabled(true);
        Alert.alert('Notifications enabled');
      }
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to update setting');
    } finally {
      setToggleLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>NotificationDemo</Text>

        <View style={{ marginBottom: 12 }}>
          <Text style={{ color: '#fff', marginBottom: 6 }}>Enable Notifications</Text>
          <Switch
            value={notifEnabled}
            onValueChange={(v) => toggleNotifications(v)}
            disabled={toggleLoading}
          />
        </View>

        <AppInput label="FCM Token" value={token || ''} onChangeText={() => {}} />

        <AppButton title="Copy Token" onPress={copyToken} />
        <View style={styles.spacer} />
        <AppButton title="Register Token" onPress={handleRegister} loading={loading} />
        <View style={styles.row}>
          <AppButton title="Send" onPress={() => navigation.navigate('Send')} />
          <AppButton title="Broadcast" onPress={() => navigation.navigate('Broadcast')} style={{ marginLeft: 8 }} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, flexGrow: 1, justifyContent: 'center' },
  card: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12 },
  title: { fontSize: 20, color: '#fff', fontWeight: '700', marginBottom: 12 },
  spacer: { height: 8 },
  row: { flexDirection: 'row', marginTop: 8 },
});
