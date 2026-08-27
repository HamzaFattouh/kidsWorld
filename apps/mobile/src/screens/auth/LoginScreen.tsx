import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useAuthStore } from '../../store/authStore';

export function LoginScreen() {
  const login = useAuthStore(s => s.login);
  return (
    <ScreenWrapper>
      <View style={styles.center}>
        <Text style={styles.title}>Login</Text>
        <Button title="Login as Parent" onPress={() => login('mock-token', 'PARENT')} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#3b82f6' }
});
