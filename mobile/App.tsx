import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import theme from './src/theme';
import { initDB } from './src/services/db';
import DashboardScreen from './src/screens/DashboardScreen';
import CustomerFormScreen from './src/screens/CustomerFormScreen';
import CustomerListScreen from './src/screens/CustomerListScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: any;
          if (route.name === 'Dashboard') iconName = 'view-dashboard';
          else if (route.name === 'NewEntry') iconName = 'account-plus';
          else if (route.name === 'Directory') iconName = 'account-group';
          else if (route.name === 'Settings') iconName = 'cog';
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2C3E50',
        tabBarInactiveTintColor: '#607D8B',
        headerStyle: { backgroundColor: '#2C3E50' },
        headerTintColor: '#fff',
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Tab.Screen name="NewEntry" component={CustomerFormScreen} options={{ title: 'New Registration' }} />
      <Tab.Screen name="Directory" component={CustomerListScreen} options={{ title: 'Directory' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    initDB().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen 
              name="CustomerForm" 
              component={CustomerFormScreen} 
              options={{ 
                headerShown: true, 
                title: 'Edit Customer',
                headerStyle: { backgroundColor: '#2C3E50' },
                headerTintColor: '#fff',
              }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
        <StatusBar style="light" />
      </PaperProvider>
    </QueryClientProvider>
  );
}
