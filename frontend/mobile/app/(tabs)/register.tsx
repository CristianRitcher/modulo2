import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator, Platform } from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

// Configuración de la API - Cambia esta URL por tu endpoint real
const API_BASE_URL = 'http://192.168.0.157:3000'; // o tu URL de producción

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    // Al menos 8 caracteres, una mayúscula, una minúscula y un número
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = async () => {
    // Validaciones básicas
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    if (!email.trim()) {
      Alert.alert('Error', 'El correo electrónico es obligatorio');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Ingresa un correo electrónico válido');
      return;
    }

    if (!password) {
      Alert.alert('Error', 'La contraseña es obligatoria');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        'Error', 
        'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, una minúscula y un número'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/create-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        Alert.alert(
          'Registro Exitoso',
          data.message,
          [
            {
              text: 'OK',
              onPress: () => {
                // Usar navigate con tipo any para evitar errores de TypeScript
                (navigation as any).navigate('VerifyEmail', { 
                  email: email.trim().toLowerCase(),
                  userId: data.userId 
                });
              },
            },
          ]
        );
      } else {
        // Manejar errores del servidor
        let errorMessage = 'Error en el registro';
        
        if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        } else if (Array.isArray(data.message)) {
          errorMessage = data.message.join('\n');
        }

        Alert.alert('Error', errorMessage);
      }
    } catch (error) {
      console.error('Error de red:', error);
      Alert.alert(
        'Error de Conexión',
        'No se pudo conectar con el servidor. Verifica tu conexión a internet e intenta nuevamente.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginNavigation = () => {
    try {
      (navigation as any).navigate('login');
    } catch (error) {
      console.error('Error de navegación:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Registrarse</Text>
        
        <View style={styles.inputContainer}>
          <Icon name="account" size={22} color="#aaa" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nombre completo"
            placeholderTextColor={'#747688'}
            value={name}
            onChangeText={setName}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="email-outline" size={22} color="#aaa" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor={'#747688'}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock-outline" size={22} color="#aaa" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor={'#747688'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!isLoading}
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          >
            <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#aaa" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Icon name="lock-outline" size={22} color="#aaa" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            placeholderTextColor={'#747688'}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            editable={!isLoading}
          />
          <TouchableOpacity 
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
          >
            <Icon name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#aaa" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Registrarse</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.orText}>ó</Text>
        
        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
            <Image
              source={{ uri: 'https://crystalpng.com/wp-content/uploads/2025/05/google-logo.png' }}
              style={{ width: 22, height: 22, marginRight: 10 }}
            />
            <Text style={styles.socialText}>Ingresar con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
            <Icon name="facebook" size={22} color="#1877F3" />
            <Text style={styles.socialText}>Ingresar con Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton} disabled={isLoading}>
            <Icon name="apple" size={22} color="#000000" />
            <Text style={styles.socialText}>Ingresar con Apple</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={handleLoginNavigation}
          disabled={isLoading}
        >
          <Text style={styles.footerText}>
            ¿Ya tienes una cuenta?{' '}
            <Text style={styles.linkText}>Iniciar Sesión</Text>
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
    // Reemplazar shadowColor, shadowOffset, etc. con boxShadow para web
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    }),
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
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
    ...(Platform.OS === 'web' ? {
      boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
    } : {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 1,
    }),
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