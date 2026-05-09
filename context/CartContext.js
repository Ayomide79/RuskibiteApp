// context/CartContext.js
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CartContext = createContext();

const CART_KEY = '@ruskibites_cart';
const ORDERS_KEY = '@ruskibites_orders';

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      const cartJson = await AsyncStorage.getItem(CART_KEY);
      const ordersJson = await AsyncStorage.getItem(ORDERS_KEY);
      if (cartJson) setCart(JSON.parse(cartJson));
      if (ordersJson) setOrders(JSON.parse(ordersJson));
    } catch (e) {
      console.error('Error loading cart data:', e);
    }
    setLoading(false);
  }, []);

  const saveCart = async (newCart) => {
    setCart(newCart);
    try {
      await AsyncStorage.setItem(CART_KEY, JSON.stringify(newCart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  };

  // Expose loadOrders for manual refresh
  const loadOrders = useCallback(async () => {
    try {
      const ordersJson = await AsyncStorage.getItem(ORDERS_KEY);
      if (ordersJson) setOrders(JSON.parse(ordersJson));
    } catch (e) {
      console.error('Error loading orders:', e);
    }
  }, []);

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      const updated = cart.map(c => 
        c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
      );
      saveCart(updated);
    } else {
      saveCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    const updated = cart.filter(c => c.id !== itemId);
    saveCart(updated);
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      const updated = cart.map(c => 
        c.id === itemId ? { ...c, quantity } : c
      );
      saveCart(updated);
    }
  };

  const clearCart = () => saveCart([]);

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const placeOrder = async (paymentMethod) => {
    const newOrder = {
      id: Date.now().toString(),
      items: [...cart],
      total: getTotal(),
      date: new Date().toISOString(),
      paymentMethod,
      status: 'completed',
    };
    
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    try {
      await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
    } catch (e) {
      console.error('Error saving order:', e);
    }
    
    clearCart();
    return newOrder;
  };

  if (loading) return null;

  return (
    <CartContext.Provider value={{
      cart,
      orders,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotal,
      getItemCount,
      placeOrder,
      loadOrders, // Exposed for manual refresh
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);