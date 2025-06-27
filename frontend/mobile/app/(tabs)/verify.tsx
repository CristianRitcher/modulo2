import React, { useEffect, useState, useRef, FC } from 'react';
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
  const [showInvalid, setShowInvalid] = useState(false);

  const inputRef = useRef<TextInput>(null);

  // ⏱️ Countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    if (token.length < 6) {
      setShowInvalid(true);
      return;
    }

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
      setToken('');
      setShowInvalid(false);
      setTimeLeft(600); // Reiniciar temporizador
      inputRef.current?.focus(); // Volver a abrir teclado
      setTimeout(() => setCanResend(true), 30000);
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

      {/* Input visual de código */}
      <CodeInput
        value={token}
        onChange={(text) => {
          setShowInvalid(false);
          setToken(text);
        }}
        showInvalid={showInvalid}
        inputRef={inputRef}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Validar código</Text>
      </TouchableOpacity>

      <Text style={styles.countdown}>
        Expira en {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
      </Text>

      <TouchableOpacity onPress={handleResend} disabled={!canResend}>
        <Text style={[styles.resend, { color: canResend ? '#DE1484' : '#999' }]}>
          {canResend ? '¿No te llegó? Reenviar código' : 'Espera unos segundos...'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Componente de input por recuadros
type CodeInputProps = {
  value: string;
  onChange: (text: string) => void;
  length?: number;
  showInvalid?: boolean;
  inputRef?: React.RefObject<TextInput | null>;
};

const CodeInput: FC<CodeInputProps> = ({
  value,
  onChange,
  length = 6,
  showInvalid = false,
  inputRef,
}) => {
  const internalRef = useRef<TextInput>(null);
  const ref = inputRef || internalRef;

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={() => ref.current?.focus()}
      style={stylesCodeInput.container}
    >
      <View style={stylesCodeInput.boxes}>
        {Array.from({ length }).map((_, i) => {
          const isFocused = value.length === i;
          const borderColor = showInvalid ? '#FF3B30' : isFocused ? '#DE1484' : '#ccc';
          return (
            <View
              key={i}
              style={[stylesCodeInput.box, { borderColor }]}
            >
              <Text style={stylesCodeInput.digit}>{value[i] || ''}</Text>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(text) => {
          if (/^\d*$/.test(text) && text.length <= length) onChange(text);
        }}
        keyboardType="number-pad"
        maxLength={length}
        style={stylesCodeInput.hiddenInput}
        autoFocus={false}
      />
    </TouchableOpacity>
  );
};

// Estilos generales
const styles = StyleSheet.create({
  container: { flex: 1, padding: 32, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 4, color: '#555' },
  email: { fontSize: 16, fontWeight: '600', color: '#DE1484', marginBottom: 24 },
  button: {
    backgroundColor: '#DE1484',
    padding: 16,
    borderRadius: 24,
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

// Estilos del CodeInput
const stylesCodeInput = StyleSheet.create({
  container: { marginBottom: 24 },
  boxes: { flexDirection: 'row', justifyContent: 'space-between' },
  box: {
    borderWidth: 2,
    borderRadius: 8,
    width: 44,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  digit: {
    fontSize: 24,
    color: '#222',
    fontWeight: 'bold',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0.01,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});
