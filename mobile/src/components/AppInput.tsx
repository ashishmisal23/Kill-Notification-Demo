import React from 'react';

import {
  TextInput,
  StyleSheet,
  View,
  Text,
} from 'react-native';

type Props = {
  label?: string;
  value?: string;
  onChangeText?: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
};

export default function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  multiline,
  numberOfLines,
}: Props) {
  return (<View style={styles.wrap}>
    {label ? (<Text style={styles.label}>
      {label} </Text>
    ) : null}


    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#6B7280"
      multiline={multiline}
      numberOfLines={numberOfLines}
      style={[
        styles.input,
        multiline && {
          height: Math.max(
            100,
            (numberOfLines || 3) * 24,
          ),
          textAlignVertical: 'top',
        },
      ]}
    />
  </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },

  label: {
    color: '#111827',


    marginBottom: 8,

    fontSize: 14,

    fontWeight: '600',


  },

  input: {
    backgroundColor: '#FFFFFF',


    color: '#111827',

    borderWidth: 1,

    borderColor: '#D1D5DB',

    borderRadius: 12,

    paddingHorizontal: 14,

    paddingVertical: 12,

    fontSize: 15,


  },
});
