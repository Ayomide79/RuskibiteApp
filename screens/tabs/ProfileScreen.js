// screens/tabs/ProfileScreen.js
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { useReservations } from '../../context/ReservationContext';
import { storage } from '../../utils/storage';
import { haptic } from '../../utils/haptics';
import { useState, useEffect, useCallback } from 'react';

const PROFILE_IMAGE = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80';

export default function ProfileScreen({ navigation }) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { orders, loadOrders } = useCart();
  const { reservations, getUpcomingReservations, loadReservations } = useReservations();
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('menu');
  const [upcomingReservations, setUpcomingReservations] = useState([]);

  // Calculate upcoming reservations whenever reservations change
  useEffect(() => {
    const upcoming = getUpcomingReservations();
    setUpcomingReservations(upcoming);
  }, [reservations, getUpcomingReservations]);

  // Initial load
  useEffect(() => {
    loadAllData();
  }, []);

  // Reload when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('Profile focused - reloading all data');
      loadAllData();
    });
    return unsubscribe;
  }, [navigation, loadAllData]);

  const loadAllData = useCallback(async () => {
    await Promise.all([
      loadFavorites(),
      loadReservations(), // Reload reservations from storage
      loadOrders(),       // Reload orders from storage
    ]);
  }, [loadReservations, loadOrders]);

  const loadFavorites = async () => {
    try {
      const favs = await storage.getFavorites();
      setFavorites(favs);
    } catch (e) {
      console.error('Error loading favorites:', e);
    }
  };

  const handleToggleTheme = () => {
    haptic.medium();
    toggleTheme();
  };

  const handleRemoveFavorite = async (itemId) => {
    Alert.alert(
      'Remove Favorite',
      'Are you sure you want to remove this item from favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: async () => {
            await storage.removeFavorite(itemId);
            haptic.light();
            await loadFavorites();
          }
        }
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            haptic.medium();
            navigation.navigate('Auth');
          }
        }
      ]
    );
  };

  const handleCancelReservation = (reservationId) => {
    Alert.alert(
      'Cancel Reservation',
      'Are you sure you want to cancel this reservation?',
      [
        { text: 'Keep It', style: 'cancel' },
        { 
          text: 'Cancel', 
          style: 'destructive',
          onPress: async () => {
            // Import cancelReservation from context
            const { cancelReservation } = useReservations();
            await cancelReservation(reservationId);
            haptic.medium();
            await loadReservations(); // Refresh after cancel
          }
        }
      ]
    );
  };

  const menuItems = [
    { icon: 'heart-outline', label: 'Favorites', color: '#E91E63', tab: 'favorites' },
    { icon: 'time-outline', label: 'Order History', color: '#2196F3', tab: 'orders' },
    { icon: 'calendar-outline', label: 'Reservations', color: '#FF9800', tab: 'reservations' },
    { icon: 'card-outline', label: 'Payment Methods', color: '#4CAF50', screen: 'PaymentMethods' },
    { icon: 'location-outline', label: 'Addresses', color: '#FF9800', screen: 'Addresses' },
    { icon: 'notifications-outline', label: 'Notifications', color: '#9C27B0', screen: 'Notifications' },
    { icon: isDark ? 'sunny-outline' : 'moon-outline', label: isDark ? 'Light Mode' : 'Dark Mode', color: '#607D8B', onPress: handleToggleTheme },
    { icon: 'help-circle-outline', label: 'Help & Support', color: '#795548', screen: 'HelpSupport' },
    { icon: 'log-out-outline', label: 'Logout', color: '#F44336', onPress: handleLogout },
  ];

  const handleMenuPress = (item) => {
    haptic.light();
    if (item.tab) {
      setActiveTab(item.tab);
    } else if (item.screen) {
      navigation.navigate(item.screen);
    } else if (item.onPress) {
      item.onPress();
    }
  };

  const renderFavoriteItem = ({ item }) => (
    <View style={[styles.favoriteCard, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.image }} style={styles.favoriteImage} />
      <View style={styles.favoriteContent}>
        <Text style={[styles.favoriteName, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.favoritePrice, { color: colors.primary }]}>${item.price}</Text>
      </View>
      <View style={styles.favoriteActions}>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => haptic.medium()}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.deleteButton, { backgroundColor: '#FFEBEE' }]}
          onPress={() => handleRemoveFavorite(item.id)}
        >
          <Ionicons name="trash-outline" size={20} color="#F44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderOrderItem = ({ item }) => (
    <View style={[styles.orderCard, { backgroundColor: colors.card }]}>
      <View style={styles.orderHeader}>
        <Text style={[styles.orderId, { color: colors.text }]}>Order #{item.id.slice(-6)}</Text>
        <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </View>
      <Text style={[styles.orderItems, { color: colors.textSecondary }]} numberOfLines={1}>
        {item.items.map(i => i.name).join(', ')}
      </Text>
      <View style={styles.orderFooter}>
        <Text style={[styles.orderStatus, { color: '#4CAF50' }]}>{item.status}</Text>
        <Text style={[styles.orderTotal, { color: colors.primary }]}>${item.total.toFixed(2)}</Text>
      </View>
    </View>
  );

  const renderReservationItem = ({ item }) => {
    // Fix: Properly format the date display
    const resDate = new Date(item.date);
    const formattedDate = resDate.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });

    return (
      <View style={[styles.reservationCard, { backgroundColor: colors.card }]}>
        <View style={styles.reservationHeader}>
          <View style={[styles.occasionBadge, { backgroundColor: colors.primary + '20' }]}>
            <Ionicons 
              name={item.occasion === 'dinner' ? 'moon' : item.occasion === 'lunch' ? 'sunny' : 'cafe'} 
              size={16} 
              color={colors.primary} 
            />
            <Text style={[styles.occasionText, { color: colors.primary }]}>
              {item.occasion.charAt(0).toUpperCase() + item.occasion.slice(1)}
            </Text>
          </View>
          <Text style={[styles.reservationStatus, { 
            color: item.status === 'confirmed' ? '#4CAF50' : '#FF9800' 
          }]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.reservationDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={18} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.text }]}>
              {formattedDate}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time" size={18} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.text }]}>{item.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="people" size={18} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.text }]}>{item.guests} guests</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="person" size={18} color={colors.textSecondary} />
            <Text style={[styles.detailText, { color: colors.text }]}>{item.name}</Text>
          </View>
        </View>

        {item.status === 'confirmed' && (
          <TouchableOpacity 
            style={[styles.cancelResButton, { borderColor: '#F44336' }]}
            onPress={() => handleCancelReservation(item.id)}
          >
            <Ionicons name="close-circle" size={18} color="#F44336" />
            <Text style={[styles.cancelResText, { color: '#F44336' }]}>Cancel Reservation</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View style={[styles.headerBackground, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <Image source={{ uri: PROFILE_IMAGE }} style={styles.avatar} />
          <Text style={[styles.name, { color: '#FFFFFF' }]}>John Doe</Text>
          <Text style={styles.email}>john.doe@email.com</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Text style={[styles.statNumber, { color: '#FFFFFF' }]}>{orders.length}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statNumber, { color: '#FFFFFF' }]}>{upcomingReservations.length}</Text>
              <Text style={styles.statLabel}>Reservations</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={[styles.statNumber, { color: '#FFFFFF' }]}>{favorites.length}</Text>
              <Text style={styles.statLabel}>Favorites</Text>
            </View>
          </View>
        </View>
      </View>

      {activeTab === 'menu' && (
        <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              onPress={() => handleMenuPress(item)}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>
              <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {activeTab === 'favorites' && (
        <View style={styles.tabContent}>
          <View style={styles.tabHeader}>
            <TouchableOpacity onPress={() => setActiveTab('menu')} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.tabTitle, { color: colors.text }]}>My Favorites</Text>
            <View style={{ width: 24 }} />
          </View>
          {favorites.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={60} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No favorites yet</Text>
            </View>
          ) : (
            <FlatList
              data={favorites}
              renderItem={renderFavoriteItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          )}
        </View>
      )}

      {activeTab === 'orders' && (
        <View style={styles.tabContent}>
          <View style={styles.tabHeader}>
            <TouchableOpacity onPress={() => setActiveTab('menu')} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.tabTitle, { color: colors.text }]}>Order History</Text>
            <View style={{ width: 24 }} />
          </View>
          {orders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={60} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No orders yet</Text>
            </View>
          ) : (
            <FlatList
              data={orders}
              renderItem={renderOrderItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          )}
        </View>
      )}

      {activeTab === 'reservations' && (
        <View style={styles.tabContent}>
          <View style={styles.tabHeader}>
            <TouchableOpacity onPress={() => setActiveTab('menu')} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.tabTitle, { color: colors.text }]}>My Reservations</Text>
            <View style={{ width: 24 }} />
          </View>
          {reservations.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={60} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No reservations yet</Text>
              <TouchableOpacity 
                style={[styles.bookButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  setActiveTab('menu');
                  navigation.navigate('Reservation');
                }}
              >
                <Text style={styles.bookButtonText}>Book a Table</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={reservations}
              renderItem={renderReservationItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBackground: {
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  menuContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  tabContent: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  tabTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  bookButton: {
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  favoriteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  favoriteImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
  },
  favoriteContent: {
    flex: 1,
    marginLeft: 16,
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  favoritePrice: {
    fontSize: 18,
    fontWeight: '800',
  },
  favoriteActions: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '800',
  },
  orderDate: {
    fontSize: 14,
  },
  orderItems: {
    fontSize: 14,
    marginBottom: 12,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '900',
  },
  reservationCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  reservationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  occasionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  occasionText: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  reservationStatus: {
    fontSize: 12,
    fontWeight: '800',
  },
  reservationDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailText: {
    fontSize: 15,
    fontWeight: '600',
  },
  cancelResButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
  },
  cancelResText: {
    fontSize: 14,
    fontWeight: '700',
  },
});