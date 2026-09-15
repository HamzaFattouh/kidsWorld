import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, useColorScheme } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import './src/i18n';
import { useAuthStore } from './src/store/authStore';
import { useThemeStore, getActiveTheme } from './src/store/themeStore';
import { usePushNotifications } from './src/services/NotificationService';
import { linkingConfig } from './src/navigation/LinkingConfig';

import { LoginScreen } from './src/screens/auth/LoginScreen';
import { MainTabs } from './src/navigation/MainTabs';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const { isAuthenticated, hydrate: hydrateAuth } = useAuthStore();
  const { theme, hydrate: hydrateTheme } = useThemeStore();
  const systemColorScheme = useColorScheme();

  // Initialize push notifications
  const { expoPushToken } = usePushNotifications();

  useEffect(() => {
    const initApp = async () => {
      await hydrateTheme();
      await hydrateAuth();
      setIsReady(true);
    };
    initApp();
  }, []);

  if (!isReady) {
    return (
      <View style={[styles.center, { backgroundColor: '#ffffff' }]}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  const activeTheme = getActiveTheme(theme);
  const isDark = activeTheme === 'dark';

  const CustomDarkTheme = {
    ...NavDarkTheme,
    colors: { ...NavDarkTheme.colors, primary: '#10b981', background: '#111827', card: '#1f2937' },
  };

  const CustomLightTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, primary: '#10b981', background: '#f9fafb', card: '#ffffff' },
  };

  return (
    <NavigationContainer theme={isDark ? CustomDarkTheme : CustomLightTheme} linking={linkingConfig}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : (
          <Stack.Screen name="MainApp" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});