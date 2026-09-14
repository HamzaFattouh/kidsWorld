import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useAuthStore } from '../../store/authStore';

export function LoginScreen() {
  const login = useAuthStore((s) => s.login);
  return (
    <ScreenWrapper>
      <View style={styles.center}>
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>تسجيل الدخول</Text>
        <Button title="Login as Parent" onPress={() => login('mock-token', 'PARENT')} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  logo: { width: 240, height: 200, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#10b981' }
});