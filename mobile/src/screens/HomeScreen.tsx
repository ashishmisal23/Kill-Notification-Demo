import React, { useState } from 'react';
import { View, Text, StyleSheet, Clipboard, Alert, ScrollView } from 'react-native';
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
  const { token } = useNotifications();
  const [loading, setLoading] = useState(false);

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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>NotificationDemo</Text>

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
