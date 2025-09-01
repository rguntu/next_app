import { Client, Account } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
    .setProject('68b5ca790034120754e6'); // Replace with your Appwrite project ID

const account = new Account(client);

export const login = async (email, password) => {
    try {
        return await account.createEmailPasswordSession(email, password);
    } catch (error) {
        console.error('Error logging in:', error);
        throw error;
    }
};

export const register = async (email, password, name) => {
    try {
        await account.create('unique()', email, password, name);
        return await login(email, password);
    } catch (error) {
        console.error('Error registering:', error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await account.deleteSession('current');
    } catch (error) {
        console.error('Error logging out:', error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    try {
        return await account.get();
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};
