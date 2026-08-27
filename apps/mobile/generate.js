const fs = require('fs');
const path = require('path');

const baseDir = path.join('d:', 'Projects', 'kidsWorld', 'kidsWorld', 'apps', 'mobile', 'src');

fs.mkdirSync(path.join(baseDir, 'store'), { recursive: true });
fs.mkdirSync(path.join(baseDir, 'screens', 'parent'), { recursive: true });
fs.mkdirSync(path.join(baseDir, 'screens', 'auth'), { recursive: true });
fs.mkdirSync(path.join(baseDir, 'navigation'), { recursive: true });
fs.mkdirSync(path.join(baseDir, 'components', 'ui'), { recursive: true });

// 1. parentStore.ts
const parentStoreContent = `import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ParentState {
  selectedChildId: string | null;
  setSelectedChildId: (id: string) => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useParentStore = create<ParentState>((set) => ({
  selectedChildId: null,
  
  setSelectedChildId: async (id) => {
    await AsyncStorage.setItem('selectedChildId', id);
    set({ selectedChildId: id });
  },

  hydrate: async () => {
    try {
      const id = await AsyncStorage.getItem('selectedChildId');
      if (id) {
        set({ selectedChildId: id });
      }
    } catch (e) {
      // ignore
    }
  }
}));
`;
fs.writeFileSync(path.join(baseDir, 'store', 'parentStore.ts'), parentStoreContent);

// 2. ScreenWrapper
const screenWrapper = `import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { useThemeStore, getActiveTheme } from '../../store/themeStore';

export function ScreenWrapper({ children }: { children: React.ReactNode }) {
  const theme = getActiveTheme(useThemeStore(s => s.theme));
  const isDark = theme === 'dark';
  
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#111827' : '#f9fafb' }]}>
      <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f9fafb' }]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16 }
});
`;
fs.writeFileSync(path.join(baseDir, 'components', 'ui', 'ScreenWrapper.tsx'), screenWrapper);

// 3. Generate screens
const parentScreens = [
  'HomeScreen', 'ChildrenScreen', 'AttendanceScreen', 'MealsScreen', 
  'WeeklyNotesScreen', 'EvaluationsScreen', 'IncidentsScreen', 
  'ComplaintsScreen', 'RequestsScreen', 'MessagesScreen', 
  'NotificationsScreen', 'EventsScreen', 'DocumentsScreen', 
  'CamerasScreen', 'ProfileScreen', 'SettingsScreen'
];

const screenTemplate = (name) => `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useParentStore } from '../../store/parentStore';

export function ${name}() {
  const selectedChildId = useParentStore(s => s.selectedChildId);
  return (
    <ScreenWrapper>
      <View style={styles.center}>
        <Text style={styles.title}>${name}</Text>
        <Text style={styles.subtitle}>Selected Child: {selectedChildId || 'None'}</Text>
        <Text style={styles.note}>UI pending backend integration.</Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#3b82f6' },
  subtitle: { fontSize: 16, marginBottom: 16, color: '#6b7280' },
  note: { fontSize: 14, color: '#9ca3af' }
});
`;

for (const screen of parentScreens) {
  fs.writeFileSync(path.join(baseDir, 'screens', 'parent', screen + '.tsx'), screenTemplate(screen));
}

// Auth Login
const loginTemplate = `import React from 'react';
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
`;
fs.writeFileSync(path.join(baseDir, 'screens', 'auth', 'LoginScreen.tsx'), loginTemplate);

console.log('Done!');
