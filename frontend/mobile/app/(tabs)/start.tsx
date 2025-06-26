// start.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';


export default function Start() {
  const navigation = useNavigation();

  const handleRegister = () => {
    navigation.navigate('register');
  };

  const handleLogin = () => {
    navigation.navigate('login');
  };

  const [animationKey, setAnimationKey] = useState(0);

  useFocusEffect(
  useCallback(() => {
    // Se ejecuta cada vez que la pantalla vuelve a estar en foco
    setAnimationKey(prev => prev + 1);
  }, [])
);


  return (
    <View style={styles.container}>
      {/* Imagen con animación FadeIn */}
      
    <Animated.Image
        key={animationKey} // Forzar el reinicio de la animación
        entering={FadeInDown.duration(1000)}
        source={require('../../assets/images/logo3.png')}
        style={styles.image}
    />


      <View style={styles.textContainer}>
        <Text style={styles.welcome}>Bienvenido a</Text>
        <Text style={styles.title}>CorreosClic</Text>
        <Text style={styles.subtitle}>
          De los talleres de México, a cada rincón del país.
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>¡Empecemos!</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.loginText}>
          ¿Ya tienes una cuenta?,{' '}
          <Text style={styles.loginLink}>Ingresa aquí</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 24,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  image: {
    width: 325,
    height: 310,
    resizeMode: 'contain',
    position: 'absolute',
    top: 180,
    left: 0,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E6007A',
  },
  subtitle: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#E6007A',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
    width: 280,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginText: {
    textAlign: 'center',
    color: '#333',
  },
  loginLink: {
    color: '#E6007A',
  },
});
