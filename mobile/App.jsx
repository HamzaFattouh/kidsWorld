import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet, useColorScheme, Text } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme as NavDarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Settings as SettingsIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import './src/i18n';
import { useAuthStore } from './src/store/authStore';
import { useThemeStore, getActiveTheme } from './src/store/themeStore';
import { usePushNotifications } from './src/services/NotificationService';
import { linkingConfig } from './src/navigation/LinkingConfig';

import { LoginScreen } from './src/screens/auth/LoginScreen';
import { ParentTabs } from './src/navigation/ParentTabs';
import { TeacherTabs } from './src/navigation/TeacherTabs';

const AdminDashboard = () => {
  const { t } = useTranslation();
  const logout = useAuthStore((s) => s.logout);
  return <View style={styles.center}><Text>{t('admin_dashboard')}</Text><Text onPress={logout} style={{ color: 'red', marginTop: 20 }}>Logout</Text></View>;
};
const SettingsScreen = () => <View style={styles.center}><Text>Settings</Text></View>;

// Navigators
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AdminTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: true }}>
      <Tab.Screen name="Dashboard" component={AdminDashboard} options={{ tabBarIcon: ({ color }) => <Home color={color} size={24} /> }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: ({ color }) => <SettingsIcon color={color} size={24} /> }} />
    </Tab.Navigator>);

}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>);

}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const { isAuthenticated, role, hydrate: hydrateAuth } = useAuthStore();
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
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>);

  }

  const activeTheme = getActiveTheme(theme);
  const isDark = activeTheme === 'dark';

  const CustomDarkTheme = {
    ...NavDarkTheme,
    colors: { ...NavDarkTheme.colors, primary: '#3b82f6', background: '#111827', card: '#1f2937' }
  };

  const CustomLightTheme = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, primary: '#3b82f6', background: '#f9fafb', card: '#ffffff' }
  };

  return (
    <NavigationContainer
      theme={isDark ? CustomDarkTheme : CustomLightTheme}
      linking={linkingConfig}>
      
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ?
        <Stack.Screen name="Auth" component={AuthStack} /> :

        <>
            {role === 'ADMIN' && <Stack.Screen name="AdminApp" component={AdminTabs} />}
            {role === 'TEACHER' && <Stack.Screen name="TeacherApp" component={TeacherTabs} />}
            {role === 'PARENT' && <Stack.Screen name="ParentApp" component={ParentTabs} />}
          </>
        }
      </Stack.Navigator>
    </NavigationContainer>);

}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});