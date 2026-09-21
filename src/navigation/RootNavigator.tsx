import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '@/theme/colors';
import { useAuthStore } from '@/store/authStore';
import { setUnauthorizedHandler } from '@/api/client';

import LoginScreen from '@/screens/Auth/LoginScreen';
import RegisterScreen from '@/screens/Auth/RegisterScreen';

import JobsListScreen from '@/screens/Jobs/JobsListScreen';
import JobDetailScreen from '@/screens/Jobs/JobDetailScreen';
import PostJobScreen from '@/screens/Jobs/PostJobScreen';
import MyApplicationsScreen from '@/screens/Jobs/MyApplicationsScreen';

import MessagesScreen from '@/screens/Messages/MessagesScreen';
import ChatScreen from '@/screens/Messages/ChatScreen';

import ProfileScreen from '@/screens/Profile/ProfileScreen';
import SettingsScreen from '@/screens/Profile/SettingsScreen';

const AuthStack = createNativeStackNavigator();
const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

const TAB_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home',
  Applications: 'briefcase',
  Messages: 'chatbubble',
  Profile: 'person',
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={TAB_ICONS[route.name] ?? 'ellipse'} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={JobsListScreen} />
      <Tab.Screen name="Applications" component={MyApplicationsScreen} options={{ title: 'My Jobs' }} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Wraps the tab bar so job detail / chat / post-job / settings can still
// push on top of the tabs, full-screen, with their own headers.
function MainNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Tabs" component={MainTabs} />
      <RootStack.Screen name="JobDetail" component={JobDetailScreen} />
      <RootStack.Screen name="PostJob" component={PostJobScreen} />
      <RootStack.Screen name="Chat" component={ChatScreen} />
      <RootStack.Screen name="Settings" component={SettingsScreen} />
    </RootStack.Navigator>
  );
}

export default function RootNavigator() {
  const { isAuthenticated, isLoading, bootstrap } = useAuthStore();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  useEffect(() => {
    // When a 401 comes back from the API (expired/invalid token), fall back
    // to the login screen instead of leaving the user stuck on private data.
    setUnauthorizedHandler(() => {
      useAuthStore.setState({ user: null, isAuthenticated: false });
    });
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bgLight }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
