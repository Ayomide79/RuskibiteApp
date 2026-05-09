import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AnimatedBottomTab from '../components/AnimatedBottomTab';

// Import tab screens
import HomeScreen from './tabs/HomeScreen';
import MenuScreen from './tabs/MenuScreen';
import ReservationScreen from './tabs/ReservationScreen';
import ProfileScreen from './tabs/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainApp() {
  return (
    <Tab.Navigator
      tabBar={(props) => <AnimatedBottomTab {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Reservation" component={ReservationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}