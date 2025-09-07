import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { signIn, signUp } from '../services/Appwrite';

const LoginScreen = ({ onLoginSuccess }) => {
  const [formType, setFormType] = useState('signin'); // 'signin' or 'signup'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthAction = async () => {
    if (!email || !password || (formType === 'signup' && !name)) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }
    setIsLoading(true);
    try {
      if (formType === 'signin') {
        await signIn(email, password);
      } else {
        await signUp(email, password, name);
        // Automatically sign in after successful sign up
        await signIn(email, password);
      }
      onLoginSuccess(); // Notify parent component (App.js) to switch stacks
    } catch (error) {
      Alert.alert('Authentication Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Read/Do Later</Text>
      
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, formType === 'signin' && styles.activeButton]}
          onPress={() => setFormType('signin')}>
          <Text style={[styles.toggleText, formType === 'signin' && styles.activeText]}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleButton, formType === 'signup' && styles.activeButton]}
          onPress={() => setFormType('signup')}>
          <Text style={[styles.toggleText, formType === 'signup' && styles.activeText]}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {formType === 'signup' && (
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {isLoading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleAuthAction}>
          <Text style={styles.buttonText}>
            {formType === 'signin' ? 'Sign In' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
  },
  activeButton: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activeText: {
    color: '#FFF',
  },
  input: {
    backgroundColor: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#DDD',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;