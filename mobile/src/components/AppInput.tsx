import React from 'react';
import { TextInput, StyleSheet, View, Text } from 'react-native';

type Props = {
  label?: string;
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
};

export default function AppInput({ label, value, onChangeText, placeholder, multiline, numberOfLines }: Props) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        style={[styles.input, multiline && { height: Math.max(80, (numberOfLines || 3) * 20) }]}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { color: '#94a3b8', marginBottom: 6 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    padding: 10,
    color: '#e6eef8',
  },
});
