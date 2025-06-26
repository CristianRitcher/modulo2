import React, { useEffect, useRef } from 'react';
import {
  View,
  Image,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Inicia animación de fade-out
    Animated.timing(fadeAnim, {
      toValue: 0, // Termina en completamente transparente
      duration: 1000, // Duración del fade-out (1 segundo)
      delay: 2000, // Espera 2 segundos antes de empezar el fade
      useNativeDriver: true,
    }).start(() => {
      router.push('/start'); // Redirige después del fade
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <ImageBackground
          source={require('@/assets/images/fondo.png')}
          style={styles.background}
          resizeMode="cover"
          blurRadius={5}
        >
          <View style={styles.content}>
            <Image
              source={require('@/assets/images/logo2.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </ImageBackground>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  background: {
    flex: 1,
    opacity: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 250,
    height: 550,
    textAlign: 'center',
  },
});
