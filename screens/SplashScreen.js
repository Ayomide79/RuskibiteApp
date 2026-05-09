import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChefHat } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const textOpacityAnim = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entrance sequence
    Animated.sequence([
      // Logo fade in and scale
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      // Text animation
      Animated.parallel([
        Animated.timing(textOpacityAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.spring(textSlideAnim, {
          toValue: 0,
          friction: 7,
          tension: 50,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Continuous slow rotation
    const rotation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 12000,
        useNativeDriver: true,
      })
    );
    rotation.start();

    // Gentle pulse breathing effect
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    // Navigate after 5 seconds with exit animation
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(textOpacityAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigation.replace('Onboarding');
      });
    }, 5000);

    return () => {
      clearTimeout(timer);
      rotation.stop();
      pulse.stop();
    };
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const combinedScale = Animated.multiply(scaleAnim, pulseAnim);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          { opacity: opacityAnim }
        ]}
      >
        {/* Animated Logo with Particles */}
        <View style={styles.logoWrapper}>
          <Animated.View 
            style={[
              styles.logoContainer,
              {
                transform: [
                  { scale: combinedScale },
                  { rotate: spin }
                ],
              }
            ]}
          >
            <View style={styles.logoCircle}>
              <ChefHat size={70} color="#8B4513" strokeWidth={1.5} />
            </View>
            
            {/* Orbiting dots */}
            <View style={[styles.orbitDot, styles.orbitTop]} />
            <View style={[styles.orbitDot, styles.orbitBottom]} />
            <View style={[styles.orbitDot, styles.orbitLeft]} />
            <View style={[styles.orbitDot, styles.orbitRight]} />
          </Animated.View>
          
          {/* Glow effect */}
          <View style={styles.glow} />
        </View>

        {/* Title with gradient */}
        <Animated.View 
          style={[
            styles.textContainer,
            {
              opacity: textOpacityAnim,
              transform: [{ translateY: textSlideAnim }],
            }
          ]}
        >
          <LinearGradient
            colors={['#8B4513', '#A0522D', '#CD853F', '#D2691E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientBackground}
          >
            <Text style={styles.title}>RuskiBites</Text>
          </LinearGradient>
          <Text style={styles.subtitle}>Culinary Artistry</Text>
        </Animated.View>
      </Animated.View>

      {/* Decorative background elements */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />
      <View style={styles.decorCircle3} />
      <View style={styles.decorCircle4} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    zIndex: 10,
  },
  logoWrapper: {
    position: 'relative',
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF8F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#8B4513',
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  glow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(139, 69, 19, 0.08)',
    zIndex: 1,
  },
  orbitDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#D2691E',
    zIndex: 3,
  },
  orbitTop: {
    top: 0,
    left: '50%',
    marginLeft: -5,
    backgroundColor: '#8B4513',
  },
  orbitBottom: {
    bottom: 0,
    left: '50%',
    marginLeft: -5,
    backgroundColor: '#CD853F',
  },
  orbitLeft: {
    left: 0,
    top: '50%',
    marginTop: -5,
    backgroundColor: '#A0522D',
  },
  orbitRight: {
    right: 0,
    top: '50%',
    marginTop: -5,
    backgroundColor: '#D2691E',
  },
  textContainer: {
    alignItems: 'center',
  },
  gradientBackground: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: '#8B4513',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
    textShadowColor: 'rgba(139, 69, 19, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#8B4513',
    marginTop: 12,
    letterSpacing: 6,
    fontWeight: '600',
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  decorCircle1: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: 'rgba(139, 69, 19, 0.03)',
    top: -120,
    right: -120,
  },
  decorCircle2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(210, 105, 30, 0.04)',
    bottom: 150,
    left: -80,
  },
  decorCircle3: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(205, 133, 63, 0.05)',
    bottom: -40,
    right: 60,
  },
  decorCircle4: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(160, 82, 45, 0.06)',
    top: 100,
    left: 40,
  },
});