import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Users, MessageSquare, Menu } from 'lucide-react-native';

// Screens
import { HomeScreen } from '../screens/parent/HomeScreen';
import { ChildrenScreen } from '../screens/parent/ChildrenScreen';
import { AttendanceScreen } from '../screens/parent/AttendanceScreen';
import { MealsScreen } from '../screens/parent/MealsScreen';
import { WeeklyNotesScreen } from '../screens/parent/WeeklyNotesScreen';
import { EvaluationsScreen } from '../screens/parent/EvaluationsScreen';

import { MessagesScreen } from '../screens/parent/MessagesScreen';
import { NotificationsScreen } from '../screens/parent/NotificationsScreen';

import { ComplaintsScreen } from '../screens/parent/ComplaintsScreen';
import { RequestsScreen } from '../screens/parent/RequestsScreen';
import { EventsScreen } from '../screens/parent/EventsScreen';
import { DocumentsScreen } from '../screens/parent/DocumentsScreen';
import { CamerasScreen } from '../screens/parent/CamerasScreen';
import { ProfileScreen } from '../screens/parent/ProfileScreen';
import { SettingsScreen } from '../screens/parent/SettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function ChildrenStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ChildrenHome" component={ChildrenScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="Meals" component={MealsScreen} />
      <Stack.Screen name="WeeklyNotes" component={WeeklyNotesScreen} />
      <Stack.Screen name="Evaluations" component={EvaluationsScreen} />
    </Stack.Navigator>);
}

function MessagesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MessagesHome" component={MessagesScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>);

}

function MoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Complaints" component={ComplaintsScreen} />
      <Stack.Screen name="Requests" component={RequestsScreen} />
      <Stack.Screen name="Events" component={EventsScreen} />
      <Stack.Screen name="Documents" component={DocumentsScreen} />
      <Stack.Screen name="Cameras" component={CamerasScreen} />
    </Stack.Navigator>);

}

export function ParentTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarIcon: ({ color }) => <Home color={color} size={24} /> }} />
      
      <Tab.Screen
        name="Children"
        component={ChildrenStack}
        options={{ tabBarIcon: ({ color }) => <Users color={color} size={24} /> }} />
      
      <Tab.Screen
        name="Inbox"
        component={MessagesStack}
        options={{ tabBarIcon: ({ color }) => <MessageSquare color={color} size={24} /> }} />
      
      <Tab.Screen
        name="More"
        component={MoreStack}
        options={{ tabBarIcon: ({ color }) => <Menu color={color} size={24} /> }} />
      
    </Tab.Navigator>);

}