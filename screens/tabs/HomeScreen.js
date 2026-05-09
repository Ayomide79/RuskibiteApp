import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  Animated,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShoppingBag } from 'lucide-react-native';
import { useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';
import { haptic } from '../../utils/haptics';

const { width } = Dimensions.get('window');

const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
  featured1: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
  featured2: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  featured3: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80',
  categoryBreakfast: 'https://images.unsplash.com/photo-1533089862017-5614ec87e284?w=400&q=80',
  categoryLunch: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80',
  categoryDinner: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80',
  categoryDessert: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&q=80',
};

// Featured products with full data for cart
const FEATURED_PRODUCTS = [
  { 
    id: 'f1', 
    name: 'Garden Fresh Bowl', 
    description: 'Organic greens with grilled tofu', 
    price: 18, 
    image: IMAGES.featured1, 
    rating: '4.9',
    category: 'Starters',
    dietary: ['vegetarian'],
    calories: 320
  },
  { 
    id: 'f2', 
    name: 'Artisan Pizza', 
    description: 'Wood-fired with fresh mozzarella', 
    price: 22, 
    image: IMAGES.featured2, 
    rating: '4.8',
    category: 'Mains',
    dietary: ['vegetarian'],
    calories: 650
  },
  { 
    id: 'f3', 
    name: 'Berry Pancakes', 
    description: 'Fluffy pancakes with maple syrup', 
    price: 14, 
    image: IMAGES.featured3, 
    rating: '5.0',
    category: 'Breakfast',
    dietary: ['vegetarian'],
    calories: 480
  },
];

export default function HomeScreen({ navigation }) {
  const { colors, isDark } = useTheme();
  const { getItemCount, addToCart } = useCart();
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [-100, 0],
    extrapolate: 'clamp',
  });

  const cartCount = getItemCount();

  // Handle adding featured product to cart
  const handleAddToCart = (product) => {
    addToCart(product);
    haptic.success();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View style={[
        styles.header, 
        { 
          opacity: headerOpacity,
          transform: [{ translateY: headerTranslate }],
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        }
      ]}>
        <Text style={[styles.headerTitle, { color: colors.primary }]}>RuskiBites</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity 
            style={[styles.headerIcon, { backgroundColor: colors.surface }]} 
            activeOpacity={0.8}
            onPress={() => {
              haptic.light();
              navigation.navigate('Cart');
            }}
          >
            <ShoppingBag size={24} color={colors.text} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.headerIcon, { backgroundColor: colors.surface }]} 
            activeOpacity={0.8}
            onPress={() => haptic.light()}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Animated.ScrollView 
        style={{ opacity: fadeAnim }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.hero}>
          <Image 
            source={{ uri: IMAGES.hero }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <Animated.Text 
              style={[
                styles.heroTitle,
                { transform: [{ translateY: slideAnim }] }
              ]}
            >
              Taste the Extraordinary
            </Animated.Text>
            <Text style={styles.heroSubtitle}>
              Experience culinary artistry with fresh, local ingredients
            </Text>
            {/* 1. FIXED: Explore Menu now links to MenuScreen */}
            <TouchableOpacity 
              style={styles.heroButton} 
              activeOpacity={0.9}
              onPress={() => {
                haptic.medium();
                navigation.navigate('Menu');
              }}
            >
              <Text style={[styles.heroButtonText, { color: colors.primary }]}>Explore Menu</Text>
              <Ionicons name="arrow-forward" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.quickActions, { backgroundColor: colors.card }]}>
          {/* 2. FIXED: Book Table now links to ReservationScreen */}
          <TouchableOpacity 
            style={styles.actionCard} 
            activeOpacity={0.8}
            onPress={() => {
              haptic.light();
              navigation.navigate('Reservation');
            }}
          >
            <View style={[styles.actionIcon, { backgroundColor: isDark ? '#3D3D3D' : '#FFF3E0' }]}>
              <Ionicons name="time-outline" size={28} color="#FF9800" />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Book Table</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard} 
            activeOpacity={0.8}
            onPress={() => haptic.light()}
          >
            <View style={[styles.actionIcon, { backgroundColor: isDark ? '#3D3D3D' : '#E8F5E9' }]}>
              <Ionicons name="bicycle-outline" size={28} color="#4CAF50" />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Delivery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard} 
            activeOpacity={0.8}
            onPress={() => haptic.light()}
          >
            <View style={[styles.actionIcon, { backgroundColor: isDark ? '#3D3D3D' : '#E3F2FD' }]}>
              <Ionicons name="gift-outline" size={28} color="#2196F3" />
            </View>
            <Text style={[styles.actionText, { color: colors.text }]}>Offers</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Chef's Special</Text>
            <TouchableOpacity 
              activeOpacity={0.7} 
              onPress={() => {
                haptic.light();
                navigation.navigate('Menu');
              }}
            >
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.horizontalScroll}
            decelerationRate="fast"
            snapToInterval={300}
          >
            {/* 3. FIXED: Products now add to cart with full data */}
            {FEATURED_PRODUCTS.map((item, index) => (
              <TouchableOpacity 
                key={item.id} 
                style={[styles.featuredCard, { backgroundColor: colors.card }, index === 0 && { marginLeft: 20 }]}
                activeOpacity={0.9}
                onPress={() => haptic.light()}
              >
                <Image 
                  source={{ uri: item.image }} 
                  style={styles.featuredImage}
                  resizeMode="cover"
                />
                <View style={styles.featuredContent}>
                  <Text style={[styles.featuredName, { color: colors.text }]}>{item.name}</Text>
                  <Text style={[styles.featuredDesc, { color: colors.textSecondary }]}>{item.description}</Text>
                  <View style={styles.featuredFooter}>
                    <Text style={[styles.featuredPrice, { color: colors.primary }]}>${item.price}</Text>
                    <View style={styles.rating}>
                      <Ionicons name="star" size={14} color="#FFB300" />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                  </View>
                </View>
                {/* FIXED: Add button now actually adds to cart */}
                <TouchableOpacity 
                  style={[styles.addButton, { backgroundColor: colors.primary }]} 
                  activeOpacity={0.8}
                  onPress={() => handleAddToCart(item)}
                >
                  <Ionicons name="add" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Categories</Text>
          <View style={styles.categoriesGrid}>
            {[
              { name: 'Breakfast', image: IMAGES.categoryBreakfast, color: '#FF9800' },
              { name: 'Lunch', image: IMAGES.categoryLunch, color: '#4CAF50' },
              { name: 'Dinner', image: IMAGES.categoryDinner, color: '#3F51B5' },
              { name: 'Dessert', image: IMAGES.categoryDessert, color: '#E91E63' },
            ].map((cat) => (
              <TouchableOpacity 
                key={cat.name} 
                style={styles.categoryCard}
                activeOpacity={0.9}
                onPress={() => {
                  haptic.light();
                  navigation.navigate('Menu');
                }}
              >
                <Image source={{ uri: cat.image }} style={styles.categoryImage} />
                <View style={[styles.categoryOverlay, { backgroundColor: cat.color + 'CC' }]}>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.promoContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80' }}
            style={styles.promoImage}
          />
          <View style={[styles.promoOverlay, { backgroundColor: colors.primary + 'D9' }]}>
            <Text style={styles.promoTitle}>Weekend Special</Text>
            <Text style={styles.promoDesc}>20% off on all organic dishes</Text>
            {/* 4. FIXED: Order Now links to Menu screen */}
            <TouchableOpacity 
              style={styles.promoButton} 
              activeOpacity={0.9}
              onPress={() => {
                haptic.medium();
                navigation.navigate('Menu');
              }}
            >
              <Text style={[styles.promoButtonText, { color: colors.primary }]}>Order Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    zIndex: 100,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF5252',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF5252',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  hero: {
    height: 480,
    position: 'relative',
  },
  heroImage: {
    width: width,
    height: 480,
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    lineHeight: 44,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.95,
    marginBottom: 24,
    lineHeight: 22,
    maxWidth: '90%',
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 30,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 28,
    paddingHorizontal: 16,
    marginTop: -30,
    borderRadius: 30,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  actionCard: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '700',
  },
  horizontalScroll: {
    marginHorizontal: -20,
  },
  featuredCard: {
    width: 280,
    borderRadius: 24,
    marginRight: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: 170,
  },
  featuredContent: {
    padding: 18,
  },
  featuredName: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  featuredDesc: {
    fontSize: 14,
    marginBottom: 14,
    lineHeight: 20,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featuredPrice: {
    fontSize: 20,
    fontWeight: '900',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FF8F00',
    marginLeft: 4,
  },
  addButton: {
    position: 'absolute',
    top: 140,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    width: (width - 52) / 2,
    height: 120,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  promoContainer: {
    margin: 20,
    marginTop: 32,
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  promoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  promoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    justifyContent: 'center',
  },
  promoTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  promoDesc: {
    fontSize: 15,
    color: '#FFFFFF',
    opacity: 0.95,
    marginBottom: 16,
  },
  promoButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    fontWeight: '800',
    fontSize: 14,
  },
});