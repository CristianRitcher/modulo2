import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

  useEffect(() => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }, []);

  const isPasswordStrong = (password: string) => {
    return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Correo inválido', 'Ingresa un correo electrónico válido');
      return;
    }

    if (!isPasswordStrong(password)) {
      Alert.alert(
        'Contraseña insegura',
        'Debe tener al menos 8 caracteres, una mayúscula y un número'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error de registro');
      }

      Alert.alert('Registro exitoso', 'Hemos enviado un código a tu correo');
      router.push({ pathname: '/verify', params: { email } });
    } catch (err) {
      const error = err as any;
      Alert.alert('Error', error.message || 'Ocurrió un error inesperado');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Registrarse</Text>

        {/* Nombre */}
        <View style={styles.inputContainer}>
          <Icon name="account" size={22} color="#aaa" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            placeholderTextColor="#747688"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Correo electrónico */}
        <View style={styles.inputContainer}>
          <Icon name="email-outline" size={22} color="#aaa" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#747688"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          {email.length > 0 && (
            <Icon
              name={isValidEmail(email) ? 'check-circle-outline' : 'alert-circle-outline'}
              size={20}
              color={isValidEmail(email) ? 'green' : 'red'}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>

        {/* Contraseña */}
        <View style={styles.inputContainer}>
          <Icon name="lock-outline" size={22} color="#aaa" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#747688"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Icon
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#aaa"
            />
          </TouchableOpacity>
        </View>

        {/* Indicador de fortaleza */}
        {password.length > 0 && (
          <Text style={{
            fontSize: 14,
            color: isPasswordStrong(password) ? 'green' : 'orange',
            marginBottom: 8
          }}>
            {isPasswordStrong(password)
              ? '✔️ Contraseña segura'
              : '⚠️ Al menos 8 caracteres, una mayúscula y un número'}
          </Text>
        )}

        {/* Confirmar contraseña */}
        <View style={styles.inputContainer}>
          <Icon name="lock-outline" size={22} color="#aaa" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            placeholderTextColor="#747688"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <Icon
              name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#aaa"
            />
          </TouchableOpacity>
          {confirmPassword.length > 0 && (
            <Icon
              name={
                confirmPassword === password
                  ? 'check-circle-outline'
                  : 'alert-circle-outline'
              }
              size={20}
              color={confirmPassword === password ? 'green' : 'red'}
              style={{ marginLeft: 8 }}
            />
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>ó</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={{ uri: 'https://crystalpng.com/wp-content/uploads/2025/05/google-logo.png' }}
              style={{ width: 22, height: 22, marginRight: 10 }}
            />
            <Text style={styles.socialText}>Ingresar con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Icon name="facebook" size={22} color="#1877F3" />
            <Text style={styles.socialText}>Ingresar con Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Icon name="apple" size={22} color="#000" />
            <Text style={styles.socialText}>Ingresar con Apple</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.footerText}>
            ¿Ya tienes una cuenta? <Text style={styles.linkText}>Ingresar</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 2,
    height: 48,
    fontSize: 16,
    color: '#222',
    marginRight: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6007A',
    borderRadius: 24,
    paddingVertical: 14,
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  orText: {
    textAlign: 'center',
    color: '#aaa',
    marginVertical: 8,
  },
  socialContainer: {
    gap: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 8,
    width: 250,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  socialText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#222',
  },
  footerText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 16,
  },
  linkText: {
    color: '#E6007A',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
