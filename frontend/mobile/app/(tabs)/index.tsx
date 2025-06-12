import React from 'react';
import { View } from 'react-native';
import RegisterScreen from '../../components/auth/RegisterScreen';

const SignupPage = () => {
  return (
    <View style={{ flex: 1 }}>
      <RegisterScreen />
    </View>
  );
};

export default SignupPage;
