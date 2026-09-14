const fs = require('fs');
const path = require('path');

const baseDir = path.join('d:', 'Projects', 'kidsWorld', 'kidsWorld', 'apps', 'mobile', 'src');
fs.mkdirSync(path.join(baseDir, 'screens', 'teacher'), { recursive: true });

const teacherScreens = [
  'DashboardScreen', 'ChildrenScreen', 'AttendanceScreen', 'MealsScreen', 
  'ActivitiesScreen', 'WeeklyNotesScreen', 'EvaluationsScreen', 'IncidentsScreen', 
  'ComplaintsScreen', 'MessagesScreen', 'NotificationsScreen', 'CalendarScreen', 
  'ProfileScreen', 'SettingsScreen'
];

const screenTemplate = (name) => `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export function ${name}() {
  return (
    <ScreenWrapper>
      <View style={styles.center}>
        <Text style={styles.title}>${name}</Text>
        <Text style={styles.note}>UI pending backend integration.</Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, color: '#3b82f6' },
  note: { fontSize: 14, color: '#9ca3af', textAlign: 'center', paddingHorizontal: 20 }
});
`;

for (const screen of teacherScreens) {
  let finalTemplate = screenTemplate(screen);
  if (['AttendanceScreen', 'MealsScreen', 'WeeklyNotesScreen'].includes(screen)) {
      finalTemplate = finalTemplate.replace('UI pending backend integration.', 'UI pending backend integration. (Optimized for rapid multi-child selection)');
  }
  fs.writeFileSync(path.join(baseDir, 'screens', 'teacher', screen + '.tsx'), finalTemplate);
}

console.log('Teacher screens generated successfully!');
