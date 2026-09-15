import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, LayoutDashboard, Settings, User } from 'lucide-react-native';

// Main Screens
import { LandingHomeScreen } from '../screens/home/LandingHomeScreen';
import { DashboardScreen } from '../screens/dashboard/DashboardScreen';
import { SettingsScreen } from '../screens/settings/SettingsScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

// Dashboard Detail Screens
import { ChildrenScreen } from '../screens/parent/ChildrenScreen';
import { AttendanceScreen } from '../screens/parent/AttendanceScreen';
import { MealsScreen } from '../screens/parent/MealsScreen';
import { WeeklyNotesScreen } from '../screens/parent/WeeklyNotesScreen';
import { EvaluationsScreen } from '../screens/parent/EvaluationsScreen';
import { IncidentsScreen } from '../screens/parent/IncidentsScreen';
import { ComplaintsScreen } from '../screens/parent/ComplaintsScreen';
import { RequestsScreen } from '../screens/parent/RequestsScreen';
import { CamerasScreen } from '../screens/parent/CamerasScreen';
import { UsersScreen } from '../screens/admin/UsersScreen';
import { ClassesScreen } from '../screens/admin/ClassesScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
      <Stack.Screen name="Users" component={UsersScreen} />
      <Stack.Screen name="Classes" component={ClassesScreen} />
      <Stack.Screen name="Children" component={ChildrenScreen} />
      <Stack.Screen name="Attendance" component={AttendanceScreen} />
      <Stack.Screen name="Meals" component={MealsScreen} />
      <Stack.Screen name="WeeklyNotes" component={WeeklyNotesScreen} />
      <Stack.Screen name="Evaluations" component={EvaluationsScreen} />
      <Stack.Screen name="Incidents" component={IncidentsScreen} />
      <Stack.Screen name="Complaints" component={ComplaintsScreen} />
      <Stack.Screen name="Requests" component={RequestsScreen} />
      <Stack.Screen name="Cameras" component={CamerasScreen} />
    </Stack.Navigator>
  );
}

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={LandingHomeScreen}
        options={{
          tabBarLabel: 'الرئيسية',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size || 22} />,
        }}
      />

      <Tab.Screen
        name="DashboardTab"
        component={DashboardStack}
        options={{
          tabBarLabel: 'اللوحة',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size || 22} />,
        }}
      />

      <Tab.Screen
        name="SettingsTab"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'الإعدادات',
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size || 22} />,
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'الحساب',
          tabBarIcon: ({ color, size }) => <User color={color} size={size || 22} />,
        }}
      />
    </Tab.Navigator>
  );
}
