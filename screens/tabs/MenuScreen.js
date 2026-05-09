import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity,
  Animated,
  TextInput,
  RefreshControl,
  Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ShoppingBag } from 'lucide-react-native';
import { useState, useRef, useEffect, useCallback } from 'react';
import { haptic } from '../../utils/haptics';
import { storage } from '../../utils/storage';
import { useTheme } from '../../context/ThemeContext';
import { useCart } from '../../context/CartContext';

const { width } = Dimensions.get('window');

const MENU_ITEMS = [
  {
    id: '1',
    name: 'Truffle Mushroom Risotto',
    description: 'Arborio rice with wild mushrooms, truffle oil, and parmesan',
    price: 24,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=600&q=80',
    dietary: ['vegetarian'],
    calories: 520,
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Pan-Seared Salmon',
    description: 'Atlantic salmon with lemon butter sauce and asparagus',
    price: 28,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
    dietary: ['gluten-free'],
    calories: 420,
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Farm Greens Salad',
    description: 'Mixed organic greens, cherry tomatoes, avocado, citrus dressing',
    price: 14,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    dietary: ['vegan', 'gluten-free'],
    calories: 180,
    rating: 4.7,
  },
  {
    id: '4',
    name: 'Wagyu Beef Burger',
    description: 'Premium wagyu patty, brioche bun, caramelized onions',
    price: 22,
    category: 'Mains',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
    dietary: [],
    calories: 650,
    rating: 4.9,
  },
  {
    id: '5',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with vanilla bean ice cream',
    price: 12,
    category: 'Desserts',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&q=80',
    dietary: ['vegetarian'],
    calories: 380,
    rating: 5.0,
  },
  {
    id: '6',
    name: 'Grilled Octopus',
    description: 'Mediterranean style with olive oil and herbs',
    price: 26,
    category: 'Starters',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
    dietary: ['gluten-free'],
    calories: 280,
    rating: 4.6,
  },
];

const CATEGORIES = ['All', 'Starters', 'Mains', 'Desserts', 'Drinks'];

export default function MenuScreen({ navigation }) {
  const { colors } = useTheme();
  const { addToCart, getItemCount } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadFavorites();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // Reload favorites when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadFavorites();
    });
    return unsubscribe;
  }, [navigation]);

  const loadFavorites = async () => {
    const favs = await storage.getFavorites();
    setFavorites(favs);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    haptic.medium();
    await new Promise(resolve => setTimeout(resolve, 1500));
    await loadFavorites();
    setRefreshing(false);
    haptic.success();
  }, []);

  const toggleFavorite = async (item) => {
    const isFav = favorites.some(f => f.id === item.id);
    if (isFav) {
      await storage.removeFavorite(item.id);
      haptic.light();
    } else {
      await storage.addFavorite(item);
      haptic.success();
    }
    // Reload favorites immediately to update UI
    await loadFavorites();
  };

  const handleAddToCart = (item) => {
    addToCart(item);
    haptic.success();
  };

  const filteredItems = MENU_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartCount = getItemCount();

  const renderItem = ({ item }) => {
    const isFav = favorites.some(f => f.id === item.id);
    
    return (
      <Animated.View 
        style={{
          opacity: fadeAnim,
          transform: [{ 
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }) 
          }],
        }}
      >
        <TouchableOpacity 
          style={[styles.menuCard, { backgroundColor: colors.card }]} 
          activeOpacity={0.9}
          onPress={() => haptic.light()}
        >
          <Image 
            source={{ uri: item.image }} 
            style={styles.menuImage}
            resizeMode="cover"
          />
          
          <TouchableOpacity 
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(item)}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={isFav ? "heart" : "heart-outline"} 
              size={22} 
              color={isFav ? "#E91E63" : colors.textSecondary} 
            />
          </TouchableOpacity>

          <View style={styles.menuContent}>
            <View style={styles.menuHeader}>
              <View style={styles.nameContainer}>
                <Text style={[styles.menuName, { color: colors.text }]}>{item.name}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={12} color="#FFB300" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>
              <Text style={[styles.menuPrice, { color: colors.primary }]}>${item.price}</Text>
            </View>
            <Text style={[styles.menuDesc, { color: colors.textSecondary }]} numberOfLines={2}>
              {item.description}
            </Text>
            <View style={styles.menuFooter}>
              <View style={styles.dietaryContainer}>
                {item.dietary.map((diet) => (
                  <View key={diet} style={styles.dietaryTag}>
                    <Text style={styles.dietaryText}>{diet}</Text>
                  </View>
                ))}
              </View>
              <Text style={[styles.calories, { color: colors.textSecondary }]}>{item.calories} cal</Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: colors.primary }]} 
            activeOpacity={0.8}
            onPress={() => handleAddToCart(item)}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Our Menu</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: colors.surface }]} 
            activeOpacity={0.8}
            onPress={() => {
              haptic.light();
              navigation.navigate('Cart');
            }}
          >
            <ShoppingBag size={22} color={colors.primary} />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount > 9 ? '9+' : cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: colors.surface }]} 
            activeOpacity={0.8}
            onPress={() => haptic.light()}
          >
            <Ionicons name="options-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search dishes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={colors.textSecondary}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.categoriesContainer}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryPill,
              { backgroundColor: colors.surface },
              selectedCategory === cat && { 
                backgroundColor: colors.primary,
              }
            ]}
            onPress={() => {
              setSelectedCategory(cat);
              haptic.light();
            }}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.categoryText,
              { color: selectedCategory === cat ? '#FFFFFF' : colors.textSecondary }
            ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.resultsContainer}>
        <Text style={[styles.resultsText, { color: colors.textSecondary }]}>
          {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} found
        </Text>
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20, paddingTop: 8, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.surface}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF5252',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 10,
  },
  categoryPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
  },
  resultsContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  resultsText: {
    fontSize: 13,
    fontWeight: '600',
  },
  menuCard: {
    flexDirection: 'row',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 16,
  },
  menuImage: {
    width: 110,
    height: 110,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  menuContent: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  menuName: {
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FF8F00',
    marginLeft: 2,
  },
  menuPrice: {
    fontSize: 17,
    fontWeight: '900',
  },
  menuDesc: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  menuFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  dietaryContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  dietaryTag: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  dietaryText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  calories: {
    fontSize: 12,
    fontWeight: '600',
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 12,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
});