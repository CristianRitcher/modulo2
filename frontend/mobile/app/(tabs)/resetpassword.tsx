import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet,} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/client';

export default function ResetPassword() {
  // Router y params
  const router = useRouter();
  const { correo, token } = useLocalSearchParams<{
    correo: string;
    token: string;
  }>();

  // Estados de los inputs y loading
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Enviar al backend
  const handleSubmit = async () => {
    if (password.length < 6) {
      return Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
    }
    if (password !== confirmPassword) {
      return Alert.alert('Error', 'Las contraseñas no coinciden');
    }

    setLoading(true);
    try {
      await api.post('/password-recovery/reset', {
        correo,
        token,
        newPassword: password,
      });
      Alert.alert('¡Éxito!', 'Tu contraseña ha sido restablecida', [
        { text: 'OK', onPress: () => router.replace('/login') }
      ]);
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'No se pudo restablecer la contraseña'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => router.back();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Restablecer Contraseña</Text>
      <Text style={styles.subtitle}>
        Ingresa tu nueva contraseña para acceder a tu cuenta
      </Text>

      {/* Nueva contraseña */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Nueva contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Confirmar contraseña */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Confirmar contraseña"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Ionicons
            name={showConfirmPassword ? 'eye-off' : 'eye'}
            size={22}
            color="#999"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Restablecer</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', justifyContent: 'center' },
  backButton: { position: 'absolute', top: 50, left: 24, zIndex: 1 },
  title: { fontSize: 24, fontWeight: '700', marginTop: 80, marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  passwordContainer: { position: 'relative', marginBottom: 16 },
  input: {
    height: 60,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    paddingRight: 45, // espacio para el ícono
  },
  eyeIcon: { position: 'absolute', right: 16, top: 18 },
  button: { backgroundColor: '#f06', padding: 16, borderRadius: 100, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
