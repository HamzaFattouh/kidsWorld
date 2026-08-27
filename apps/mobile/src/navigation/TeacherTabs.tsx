import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Users, MessageSquare, Menu } from 'lucide-react-native';

// Screens
import { DashboardScreen } from '../screens/teacher/DashboardScreen';
import { ChildrenScreen } from '../screens/teacher/ChildrenScreen';
import { AttendanceScreen } from '../screens/teacher/AttendanceScreen';
import { MealsScreen } from '../screens/teacher/MealsScreen';
import { ActivitiesScreen } from '../screens/teacher/ActivitiesScreen';
import { WeeklyNotesScreen } from '../screens/teacher/WeeklyNotesScreen';
import { EvaluationsScreen } from '../screens/teacher/EvaluationsScreen';
import { IncidentsScreen } from '../screens/teacher/IncidentsScreen';

import { MessagesScreen } from '../screens/teacher/MessagesScreen';
import { NotificationsScreen } from '../screens/teacher/NotificationsScreen';

import { ComplaintsScreen } from '../screens/teacher/ComplaintsScreen';
import { CalendarScreen } from '../screens/teacher/CalendarScreen';
import { ProfileScreen } from '../screens/teacher/ProfileScreen';
import { SettingsScreen } from '../screens/teacher/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ClassroomStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChildrenHome" component={ChildrenScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="Meals" component={MealsScreen} />
      <Stack.Screen name="Activities" component={ActivitiesScreen} />
      <Stack.Screen name="WeeklyNotes" component={WeeklyNotesScreen} />
      <Stack.Screen name="Evaluations" component={EvaluationsScreen} />
      <Stack.Screen name="Incidents" component={IncidentsScreen} />
    </Stack.Navigator>
  );
}

function MessagesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MessagesHome" component={MessagesScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

function MoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Complaints" component={ComplaintsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export function TeacherTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen} 
        options={{ tabBarIcon: ({ color }) => <Home color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Classroom" 
        component={ClassroomStack} 
        options={{ tabBarIcon: ({ color }) => <Users color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="Inbox" 
        component={MessagesStack} 
        options={{ tabBarIcon: ({ color }) => <MessageSquare color={color} size={24} /> }} 
      />
      <Tab.Screen 
        name="More" 
        component={MoreStack} 
        options={{ tabBarIcon: ({ color }) => <Menu color={color} size={24} /> }} 
      />
    </Tab.Navigator>
  );
}
