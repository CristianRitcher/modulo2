import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
// @ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import SwitchToggle from 'react-native-switch-toggle';


const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    Alert.alert('Éxito', 'Ingreso exitoso');
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
        </TouchableOpacity>

        <Image
          source={require('../../assets/images/logo1.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Ingresar</Text>

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

        {/* Switch + Olvidaste tu contraseña */}
        <View style={styles.rememberContainer}>
          <View style={styles.rememberItem}>
            <SwitchToggle
              switchOn={rememberMe}
              onPress={() => setRememberMe(!rememberMe)}
              circleColorOff="#fff"
              circleColorOn="#fff"
              backgroundColorOn="#E6007A"
              backgroundColorOff="#ccc"
              containerStyle={styles.switch}
              circleStyle={styles.switchCircle}
            />
            <Text style={styles.rememberText}>Recordar cuenta</Text>
          </View>

          <TouchableOpacity>
            <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Ingresar</Text>
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
            <Icon name="apple" size={22} color="#000000" />
            <Text style={styles.socialText}>Ingresar con apple</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate('register')}>
          <Text style={styles.footerText}>
            ¿Aún no tienes una cuenta?{' '}
            <Text style={styles.linkText}>Regístrate</Text>
          </Text>
</TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 40,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  logo: {
    width: 130,
    height: 130,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '500',
    marginBottom: 16,
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
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  rememberItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    width: 50,
    height: 25,
    borderRadius: 15,
    padding: 2,
    marginRight: 8,
  },
  switchCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  rememberText: {
    fontSize: 14,
    color: '#222',
  },
  forgotText: {
    fontSize: 14,
    color: '#222',
    fontWeight: '500',
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
  backButton: {
    position: 'absolute',
    top: 24,
    left: 0,
    padding: 8,
    zIndex: 10,
  },
});

export default RegisterScreen;
