import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { useThemeStore, getActiveTheme } from '../../store/themeStore';

export function ScreenWrapper({ children }) {
  const theme = getActiveTheme(useThemeStore((s) => s.theme));
  const isDark = theme === 'dark';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: isDark ? '#111827' : '#f9fafb' }]}>
      <View style={[styles.container, { backgroundColor: isDark ? '#111827' : '#f9fafb' }]}>
        {children}
      </View>
    </SafeAreaView>);

}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, padding: 16 }
});