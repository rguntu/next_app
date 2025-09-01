import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { login, register } from '../services/Appwrite';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleLogin = async () => {
        try {
            await login(email, password);
            navigation.replace('Home');
        } catch (error) {
            Alert.alert('Error', 'Invalid email or password.');
        }
    };

    const handleRegister = async () => {
        try {
            await register(email, password, name);
            navigation.replace('Home');
        } catch (error) {
            Alert.alert('Error', 'Could not register. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{isRegistering ? 'Register' : 'Login'}</Text>
            {isRegistering && (
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
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
            {isRegistering ? (
                <Button title="Register" onPress={handleRegister} />
            ) : (
                <Button title="Login" onPress={handleLogin} />
            )}
            <Button
                title={isRegistering ? 'Back to Login' : 'Create an account'}
                onPress={() => setIsRegistering(!isRegistering)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 24,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
    },
});

export default LoginScreen;
