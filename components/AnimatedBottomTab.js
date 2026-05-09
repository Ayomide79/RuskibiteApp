import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Tab configuration
const TABS = [
  { name: 'Home', icon: 'home', label: 'Home' },
  { name: 'Menu', icon: 'restaurant', label: 'Menu' },
  { name: 'Reservation', icon: 'calendar', label: 'Book' },
  { name: 'Profile', icon: 'person', label: 'Profile' },
];

export default function AnimatedBottomTab({ state, descriptors, navigation }) {
  const [selectedIndex, setSelectedIndex] = useState(state.index);
  
  // Animation values
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const indicatorScale = useRef(new Animated.Value(1)).current;
  const iconScales = useRef(TABS.map(() => new Animated.Value(1))).current;
  const labelOpacities = useRef(TABS.map(() => new Animated.Value(0.6))).current;

  const tabWidth = width / TABS.length;
  const indicatorWidth = 64;

  useEffect(() => {
    // Animate indicator to new position
    Animated.spring(indicatorPosition, {
      toValue: state.index * tabWidth + (tabWidth - indicatorWidth) / 2,
      useNativeDriver: true,
      friction: 8,
      tension: 100,
    }).start();

    // Pulse animation on indicator
    Animated.sequence([
      Animated.timing(indicatorScale, {
        toValue: 1.15,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(indicatorScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate icons and labels
    TABS.forEach((_, index) => {
      const isSelected = state.index === index;
      
      // Icon scale animation
      Animated.spring(iconScales[index], {
        toValue: isSelected ? 1.2 : 1,
        useNativeDriver: true,
        friction: 5,
      }).start();

      // Label opacity animation
      Animated.timing(labelOpacities[index], {
        toValue: isSelected ? 1 : 0.6,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });

    setSelectedIndex(state.index);
  }, [state.index]);

  const handlePress = (index, routeName, isFocused) => {
    if (isFocused) return;

    // Haptic feedback effect (visual)
    Animated.sequence([
      Animated.timing(iconScales[index], {
        toValue: 0.8,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.spring(iconScales[index], {
        toValue: 1.2,
        useNativeDriver: true,
        friction: 3,
      }),
    ]).start();

    navigation.navigate(routeName);
  };

  return (
    <View style={styles.container}>
      {/* Background with glass effect */}
      <View style={styles.glassBackground} />
      
      {/* Animated sliding indicator */}
      <Animated.View 
        style={[
          styles.indicator,
          {
            width: indicatorWidth,
            transform: [
              { translateX: indicatorPosition },
              { scale: indicatorScale },
            ],
          }
        ]} 
      />

      {/* Tab buttons */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab, index) => {
          const route = state.routes.find(r => r.name === tab.name);
          const isFocused = state.index === index;

          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => handlePress(index, tab.name, isFocused)}
              style={styles.tabButton}
              activeOpacity={0.7}
            >
              <Animated.View 
                style={[
                  styles.iconContainer,
                  { transform: [{ scale: iconScales[index] }] }
                ]}
              >
                <Ionicons 
                  name={isFocused ? tab.icon : `${tab.icon}-outline`}
                  size={26}
                  color={isFocused ? '#FFFFFF' : '#8B7355'}
                />
              </Animated.View>
              
              <Animated.Text 
                style={[
                  styles.tabLabel,
                  { 
                    opacity: labelOpacities[index],
                    color: isFocused ? '#8B4513' : '#8B7355',
                  }
                ]}
              >
                {tab.label}
              </Animated.Text>

              {/* Active dot */}
              {isFocused && (
                <Animated.View style={styles.activeDot} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
  },
  glassBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 20,
  },
  indicator: {
    position: 'absolute',
    top: 12,
    height: 50,
    backgroundColor: '#8B4513',
    borderRadius: 25,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: '100%',
    paddingTop: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  activeDot: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D2691E',
  },
});