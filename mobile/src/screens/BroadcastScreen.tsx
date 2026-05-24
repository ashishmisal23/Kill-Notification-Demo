import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AppInput from '../components/AppInput';
import AppButton from '../components/AppButton';
import { sendToAllApi } from '../services/api';

export default function BroadcastScreen() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleBroadcast() {
    if (!title) return Alert.alert('Validation', 'Title is required');
    setLoading(true);
    try {
      await sendToAllApi({ title, body });
      Alert.alert('Success', 'Broadcast sent');
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
          <AppInput label="Title" value={title} onChangeText={setTitle} placeholder="Broadcast title" />
          <AppInput label="Body" value={body} onChangeText={setBody} placeholder="Broadcast body" multiline numberOfLines={3} />
          <AppButton title="Send To All" onPress={handleBroadcast} loading={loading} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  card: { backgroundColor: 'rgba(255,255,255,0.03)', padding: 16, borderRadius: 12 },
});
