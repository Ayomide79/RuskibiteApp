import { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Dimensions,
  Animated,
  FlatList 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const DIETARY_OPTIONS = [
  { id: '1', icon: 'leaf', label: 'Vegetarian', color: '#4CAF50' },
  { id: '2', icon: 'flame', label: 'Spicy Food', color: '#FF5722' },
  { id: '3', icon: 'fish', label: 'Seafood', color: '#2196F3' },
  { id: '4', icon: 'fitness', label: 'Healthy', color: '#9C27B0' },
  { id: '5', icon: 'pizza', label: 'Comfort', color: '#FF9800' },
  { id: '6', icon: 'wine', label: 'Fine Dining', color: '#795548' },
];

const CUISINE_OPTIONS = [
  { id: '1', label: 'Italian', emoji: '🍝' },
  { id: '2', label: 'Asian', emoji: '🍜' },
  { id: '3', label: 'Mexican', emoji: '🌮' },
  { id: '4', label: 'Mediterranean', emoji: '🥗' },
  { id: '5', label: 'Indian', emoji: '🍛' },
  { id: '6', label: 'American', emoji: '🍔' },
];

export default function OnboardingScreen({ navigation }) {
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  
  const slideAnim = useRef(new Animated.Value(width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const toggleSelection = (id, type) => {
    if (type === 'dietary') {
      setSelectedDietary(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    } else {
      setSelectedCuisine(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
    }
  };

  const handleNext = () => {
    if (currentStep < 2) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentStep(prev => prev + 1);
        slideAnim.setValue(width);
      });
    } else {
      navigation.replace('Auth');
    }
  };

  const renderStep = () => {
    switch(currentStep) {
      case 0:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What are you into?</Text>
            <Text style={styles.stepSubtitle}>Select your dietary preferences</Text>
            <View style={styles.optionsGrid}>
              {DIETARY_OPTIONS.map((item, index) => {
                const isSelected = selectedDietary.includes(item.id);
                
                return (
                  <Animated.View
                    key={item.id}
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
                      style={[
                        styles.optionCard,
                        isSelected && { 
                          backgroundColor: item.color,
                          borderColor: item.color,
                        }
                      ]}
                      onPress={() => toggleSelection(item.id, 'dietary')}
                      activeOpacity={0.8}
                    >
                      <Ionicons 
                        name={item.icon} 
                        size={32} 
                        color={isSelected ? '#FFF' : item.color} 
                      />
                      <Text style={[
                        styles.optionLabel,
                        isSelected && { color: '#FFF' }
                      ]}>
                        {item.label}
                      </Text>
                      {isSelected && (
                        <View style={styles.checkmark}>
                          <Ionicons name="checkmark-circle" size={20} color="#FFF" />
                        </View>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                );
              })}
            </View>
          </View>
        );
      
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Favorite Cuisines?</Text>
            <Text style={styles.stepSubtitle}>Tap to select multiple</Text>
            <View style={styles.cuisineGrid}>
              {CUISINE_OPTIONS.map((item) => {
                const isSelected = selectedCuisine.includes(item.id);
                
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.cuisineCard,
                      isSelected && styles.cuisineCardSelected
                    ]}
                    onPress={() => toggleSelection(item.id, 'cuisine')}
                  >
                    <Text style={styles.cuisineEmoji}>{item.emoji}</Text>
                    <Text style={[
                      styles.cuisineLabel,
                      isSelected && styles.cuisineLabelSelected
                    ]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      
      case 2:
        return (
          <View style={styles.stepContainer}>
            <View style={styles.successContainer}>
              <Animated.View style={[
                styles.successCircle,
                {
                  transform: [{ scale: scaleAnim }],
                }
              ]}>
                <Ionicons name="checkmark" size={60} color="#FFF" />
              </Animated.View>
              <Text style={styles.successTitle}>All Set!</Text>
              <Text style={styles.successText}>
                We'll curate the perfect dining experience based on your preferences.
              </Text>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress dots */}
      <View style={styles.progressContainer}>
        {[0, 1, 2].map((step) => (
          <View key={step} style={[
            styles.progressDot,
            currentStep === step && styles.progressDotActive,
            currentStep > step && styles.progressDotCompleted
          ]} />
        ))}
      </View>

      {/* Content */}
      <Animated.View style={[
        styles.content,
        {
          transform: [{ translateX: slideAnim }],
          opacity: fadeAnim,
        }
      ]}>
        {renderStep()}
      </Animated.View>

      {/* Bottom button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={() => navigation.replace('Auth')}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#8B4513', '#D2691E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === 2 ? 'Get Started' : 'Continue'}
            </Text>
            <Ionicons 
              name={currentStep === 2 ? 'arrow-forward' : 'chevron-forward'} 
              size={20} 
              color="#FFF" 
              style={{ marginLeft: 8 }}
            />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 8,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#E0E0E0',
  },
  progressDotActive: {
    backgroundColor: '#8B4513',
    width: 30,
  },
  progressDotCompleted: {
    backgroundColor: '#D2691E',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2C1810',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#8B7355',
    marginBottom: 32,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    width: (width - 72) / 2,
    backgroundColor: '#FFF8F0',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5E6D3',
    position: 'relative',
  },
  optionLabel: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#5D4037',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  cuisineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cuisineCard: {
    width: (width - 72) / 3,
    backgroundColor: '#FFF8F0',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F5E6D3',
  },
  cuisineCardSelected: {
    backgroundColor: '#8B4513',
    borderColor: '#8B4513',
  },
  cuisineEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  cuisineLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5D4037',
  },
  cuisineLabelSelected: {
    color: '#FFF',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2C1810',
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    color: '#8B7355',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  bottomContainer: {
    padding: 24,
    paddingBottom: 40,
  },
  skipButton: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  skipText: {
    color: '#8B7355',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});