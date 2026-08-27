import os

base_dir = r'd:\Projects\kidsWorld\kidsWorld\apps\mobile\src'
os.makedirs(os.path.join(base_dir, 'store'), exist_ok=True)
os.makedirs(os.path.join(base_dir, 'screens', 'parent'), exist_ok=True)
os.makedirs(os.path.join(base_dir, 'screens', 'auth'), exist_ok=True)
os.makedirs(os.path.join(base_dir, 'navigation'), exist_ok=True)
os.makedirs(os.path.join(base_dir, 'components', 'ui'), exist_ok=True)

# 1. parentStore.ts
parent_store_content = '''import { create } from 'zustand';
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
'''
with open(os.path.join(base_dir, 'store', 'parentStore.ts'), 'w') as f:
    f.write(parent_store_content)

# 2. ScreenWrapper component
screen_wrapper = '''import React from 'react';
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
'''
with open(os.path.join(base_dir, 'components', 'ui', 'ScreenWrapper.tsx'), 'w') as f:
    f.write(screen_wrapper)

# 3. Generate all 17 screens
parent_screens = [
  'HomeScreen', 'ChildrenScreen', 'AttendanceScreen', 'MealsScreen', 
  'WeeklyNotesScreen', 'EvaluationsScreen', 'IncidentsScreen', 
  'ComplaintsScreen', 'RequestsScreen', 'MessagesScreen', 
  'NotificationsScreen', 'EventsScreen', 'DocumentsScreen', 
  'CamerasScreen', 'ProfileScreen', 'SettingsScreen'
]

screen_template = '''import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useParentStore } from '../../store/parentStore';

export function {screen_name}() {
  const selectedChildId = useParentStore(s => s.selectedChildId);
  return (
    <ScreenWrapper>
      <View style={styles.center}>
        <Text style={styles.title}>{screen_name}</Text>
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
'''

for screen in parent_screens:
    with open(os.path.join(base_dir, 'screens', 'parent', f'{screen}.tsx'), 'w') as f:
        f.write(screen_template.replace('{screen_name}', screen))

# Auth Login Screen
login_template = '''import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useAuthStore } from '../../store/authStore';

export function LoginScreen() {
  const login = useAuthStore(s => s.login);
  return (
    <ScreenWrapper>
      <View style={styles.center}>
        <Text style={styles.title}>Login</Text>
        <Button title=\"Login as Parent\" onPress={() => login('mock-token', 'PARENT')} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24, color: '#3b82f6' }
});
'''
with open(os.path.join(base_dir, 'screens', 'auth', 'LoginScreen.tsx'), 'w') as f:
    f.write(login_template)

print('All screens generated successfully!')
