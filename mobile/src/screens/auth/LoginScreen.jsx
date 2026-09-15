import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useAuthStore } from '../../store/authStore';
import { API_URL } from '../../services/api';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loginWithCredentials, isLoading, error } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) return;
    await loginWithCredentials(email, password);
  };

  return (
    <ScreenWrapper>
      <View style={styles.center}>
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>تسجيل الدخول</Text>
        <Text style={styles.backendNotice}>Backend: {API_URL}</Text>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email / Username"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {isLoading ? (
          <ActivityIndicator size="large" color="#10b981" style={{ marginVertical: 12 }} />
        ) : (
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
            <Text style={styles.loginBtnText}>دخول</Text>
          </TouchableOpacity>
        )}

        <View style={styles.divider}>
          <Text style={styles.dividerText}>أو اختار تجربة سريعة</Text>
        </View>

        <View style={styles.quickButtons}>
          <Button title="Parent" onPress={() => login('mock-token', 'PARENT')} color="#10b981" />
          <View style={{ width: 8 }} />
          <Button title="Teacher" onPress={() => login('mock-token', 'TEACHER')} color="#3b82f6" />
          <View style={{ width: 8 }} />
          <Button title="Admin" onPress={() => login('mock-token', 'ADMIN')} color="#8b5cf6" />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  logo: { width: 180, height: 140, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4, color: '#10b981' },
  backendNotice: { fontSize: 11, color: '#9ca3af', marginBottom: 16, textAlign: 'center' },
  input: {
    width: '100%',
    height: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  loginBtn: {
    width: '100%',
    height: 48,
    backgroundColor: '#10b981',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  loginBtnText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  errorText: { color: '#ef4444', marginBottom: 12, textAlign: 'center' },
  divider: { marginVertical: 16 },
  dividerText: { color: '#6b7280', fontSize: 12 },
  quickButtons: { flexDirection: 'row', justifyContent: 'center', width: '100%' },
});