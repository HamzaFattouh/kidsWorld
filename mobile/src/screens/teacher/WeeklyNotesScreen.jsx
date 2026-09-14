import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function WeeklyNotesScreen() {
  return (
    <ScreenWrapper>
      <View style={styles.center}>
        <Text style={styles.title}>WeeklyNotesScreen</Text>
        <Text style={styles.note}>UI pending backend integration. (Optimized for rapid multi-child selection)</Text>
      </View>
    </ScreenWrapper>);

}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#3b82f6' },
  note: { fontSize: 14, color: '#9ca3af', textAlign: 'center', paddingHorizontal: 20 }
});