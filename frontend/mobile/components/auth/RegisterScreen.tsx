import React, { useState } from 'react';
import { SafeAreaView, View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    // Aquí va tu lógica de registro real
    Alert.alert('Éxito', 'Usuario registrado correctamente');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
           <TouchableOpacity
            style={styles.backButton}
            // Aquí puedes modificar la acción de regreso.
            // Por defecto, navigation.goBack() regresa a la pantalla anterior en la pila de navegación.
            // Si quieres ir siempre a la pantalla de Login, usa: navigation.navigate('Login')
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={28} color="#222" />
          </TouchableOpacity>
          <View style={{ marginTop: 40, paddingHorizontal: 1 }}>
            <Text style={{ fontSize: 30, fontWeight: '500' }}>Registrarse</Text>
          </View>
          <View style={styles.inputContainer}>
            <Icon name="account" size={22} color="#aaa" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="email-outline" size={22} color="#aaa" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock-outline" size={22} color="#aaa" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#aaa" />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock-outline" size={22} color="#aaa" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Icon name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#aaa" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Ingresar</Text>
            <View style={styles.circleIcon}>
              <Icon name="arrow-right" size={22} color="#fff" />
            </View>
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
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerText}>
                ¿Ya tienes una cuenta? <Text style={styles.linkText}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '500', // Cambia 'bold' por '500' o 'normal'
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
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#222',
  },
  button: {
    backgroundColor: '#E6007A',
    borderRadius: 32,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
    width: 320, // Ajusta el ancho a tu gusto
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // Aumenta el padding derecho para el círculo
    paddingRight: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  circleIcon: {
    position: 'absolute',
    right: 20,
    top: '50%',
    marginTop: 1, // Centra el círculo verticalmente (la mitad de height)
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orText: {
    textAlign: 'center',
    color: '#aaa',
    marginVertical: 8,
  },
  socialContainer: {
    gap: 12,
    marginBottom: 16,
    alignItems: 'center', // Centra los botones
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D3D4E240', // Camb
    borderRadius: 24, // Más redondeado
    paddingVertical: 12, // Más alto
    paddingHorizontal: 24, // Más ancho
    marginBottom: 8,
    width: 250, // Más ancho, igual que el botón principal
    alignSelf: 'center',
    justifyContent: 'center',
  },
  socialText: {
    marginLeft: 12,
    fontSize: 18, // Más grande
    color: '#222',
    fontWeight: '400', // Opcional, para que se vea más fuerte
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
  backButton: {
    position: 'absolute',
    top: 24,
    left: 0,
    padding: 8,
    zIndex: 10,
  },
});

export default RegisterScreen;