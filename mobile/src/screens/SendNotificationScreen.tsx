import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { sendNotificationApi } from '../services/api';

export default function SendNotificationScreen() {
  const [token, setToken] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState('');
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!token) return Alert.alert('Validation', 'Device token is required');
    if (!title) return Alert.alert('Validation', 'Title is required');

    let parsedData = {};
    if (data) {
      try {
        parsedData = JSON.parse(data);
      } catch (err) {
        return Alert.alert('Invalid JSON', 'Check data payload');
      }
    }

    setLoading(true);
    try {
      await sendNotificationApi({ token, title, body, image: image || undefined, data: parsedData });
      Alert.alert('Success', 'Notification sent');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to send');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <AppInput label="Device Token" value={token} onChangeText={setToken} placeholder="FCM token" />
          <AppInput label="Title" value={title} onChangeText={setTitle} placeholder="Notification title" />
          <AppInput label="Body" value={body} onChangeText={setBody} placeholder="Notification body" multiline numberOfLines={3} />
          <AppInput label="Image URL" value={image} onChangeText={setImage} placeholder="https://..." />
          <AppInput label="Data (JSON)" value={data} onChangeText={setData} placeholder='{"key":"value"}' multiline numberOfLines={4} />

          <AppButton title="Send Notification" onPress={handleSend} loading={loading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12 },
});
