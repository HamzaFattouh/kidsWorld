import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useParentStore } from '../../store/parentStore';

export function ProfileScreen() {
  const selectedChildId = useParentStore((s) => s.selectedChildId);
  return (
    <ScreenWrapper>
      <View style={styles.center}>
        <Text style={styles.title}>ProfileScreen</Text>
        <Text style={styles.subtitle}>Selected Child: {selectedChildId || 'None'}</Text>
        <Text style={styles.note}>UI pending backend integration.</Text>
      </View>
    </ScreenWrapper>);

}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#3b82f6' },
  subtitle: { fontSize: 16, marginBottom: 16, color: '#6b7280' },
  note: { fontSize: 14, color: '#9ca3af' }
});