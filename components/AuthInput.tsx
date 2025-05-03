// components/AuthInput.tsx
import React from 'react';
import { TextInput, Text, View, StyleSheet } from 'react-native';

export const AuthInput = ({
  label,
  value,
  onChangeText,
  secureTextEntry,
  placeholder,
  placeholderTextColor = '#aaa',
  textColor = '#000',
  backgroundColor = '#fff',
}: any) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={{ color: '#fff', marginBottom: 4 }}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      style={[
        styles.input,
        { color: textColor, backgroundColor },
      ]}
    />
  </View>
);

const styles = StyleSheet.create({
  input: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
});
