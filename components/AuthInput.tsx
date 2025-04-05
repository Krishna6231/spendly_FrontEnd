import { TextInput, View, Text } from 'react-native';

type AuthInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
};

export const AuthInput = ({
  label,
  value,
  onChangeText,
  secureTextEntry = false,
}: AuthInputProps) => (
  <View style={{ marginBottom: 12 }}>
    <Text style={{ marginBottom: 4 }}>{label}</Text>
    <TextInput
      style={{
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
      }}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
    />
  </View>
);
