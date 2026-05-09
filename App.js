// App.js
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './navigation/AppNavigator';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { ReservationProvider } from './context/ReservationContext';

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <ReservationProvider>
          <StatusBar style="auto" />
          <AppNavigator />
        </ReservationProvider>
      </CartProvider>
    </ThemeProvider>
  );
}