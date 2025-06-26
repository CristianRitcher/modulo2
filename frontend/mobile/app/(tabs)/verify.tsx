import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, router } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function VerifyTokenScreen() {
  const { email } = useLocalSearchParams();
  const [token, setToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutos
  const [canResend, setCanResend] = useState(true);

  // ⏱️ Countdown en segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    try {
      await axios.get(`${API_URL}/users/verify?token=${token}`);
      Alert.alert('Verificación exitosa', 'Ya puedes iniciar sesión');
      router.replace('/login');
    } catch {
      Alert.alert('Token inválido o expirado');
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      await axios.post(`${API_URL}/users/resend-verification`, { email });
      Alert.alert('📬 Código reenviado a tu correo');
      setCanResend(false);
      setTimeout(() => setCanResend(true), 30000); // 30 segundos
    } catch (err) {
      const error = err as any;
      Alert.alert('Error al reenviar', error.response?.data?.message || 'Inténtalo más tarde');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verifica tu cuenta</Text>
      <Text style={styles.subtitle}>Código enviado a:</Text>
      <Text style={styles.email}>{email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Código de 6 dígitos"
        keyboardType="number-pad"
        maxLength={6}
        value={token}
        onChangeText={setToken}
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Validar código</Text>
      </TouchableOpacity>

      <Text style={styles.countdown}>
        Expira en {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </Text>

      <TouchableOpacity onPress={handleResend} disabled={!canResend}>
        <Text style={[styles.resend, { color: canResend ? '#2e86de' : '#999' }]}>
          {canResend ? '¿No te llegó? Reenviar código' : 'Espera unos segundos...'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 32, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 4, color: '#555' },
  email: { fontSize: 16, fontWeight: '600', color: '#2e86de', marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    color: '#222', // ✔️ Color visible al escribir
  },
  button: {
    backgroundColor: '#2e86de',
    padding: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  countdown: {
    marginTop: 12,
    textAlign: 'center',
    color: '#888',
  },
  resend: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 14,
  },
});