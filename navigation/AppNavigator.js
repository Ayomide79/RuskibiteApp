// navigation/AppNavigator.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, useEffect } from 'react';

// Screens
import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthScreen from '../screens/AuthScreen';
import MainApp from '../screens/MainApp';
import CartScreen from '../screens/CartScreen';
import PaymentScreen from '../screens/PaymentScreen';

// New Profile Screens
import PaymentMethodsScreen from '../screens/PaymentMethodsScreen';
import AddressesScreen from '../screens/AddressesScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animation: 'fade',
          animationDuration: 400,
        }}
      >
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
          options={{ animation: 'none' }}
        />
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
        />
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen}
        />
        <Stack.Screen 
          name="MainApp" 
          component={MainApp}
          options={{ animation: 'slide_from_bottom' }}
        />
        <Stack.Screen 
          name="Cart" 
          component={CartScreen}
          options={{ presentation: 'modal' }}
        />
        <Stack.Screen 
          name="Payment" 
          component={PaymentScreen}
          options={{ presentation: 'modal' }}
        />
        
        {/* Profile Menu Screens */}
        <Stack.Screen 
          name="PaymentMethods" 
          component={PaymentMethodsScreen}
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
        <Stack.Screen 
          name="Addresses" 
          component={AddressesScreen}
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
        <Stack.Screen 
          name="Notifications" 
          component={NotificationsScreen}
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
        <Stack.Screen 
          name="HelpSupport" 
          component={HelpSupportScreen}
          options={{ presentation: 'card', animation: 'slide_from_right' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}