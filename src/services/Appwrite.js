import { Client, Account, ID } from 'appwrite';

// Initialize the Appwrite client
const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // Your Appwrite Endpoint
    .setProject('68b5ca790034120754e6'); // Your project ID

const account = new Account(client);

/**
 * Signs in the user with email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} A promise that resolves to the user session.
 */
export const signIn = (email, password) => {
  return account.createEmailPasswordSession(email, password);
};

/**
 * Creates a new user account.
 * @param {string} email - The new user's email.
 * @param {string} password - The new user's password.
 * @param {string} name - The new user's name.
 * @returns {Promise<object>} A promise that resolves to the newly created user.
 */
export const signUp = (email, password, name) => {
  return account.create(ID.unique(), email, password, name);
};

/**
 * Signs out the current user.
 * @returns {Promise<object>} A promise that resolves when the session is deleted.
 */
export const signOut = () => {
  return account.deleteSession('current');
};

/**
 * Gets the currently logged-in user.
 * @returns {Promise<object>} A promise that resolves to the user object or null.
 */
export const getCurrentUser = () => {
  return account.get();
};

// It's a good practice to export the account object if you need more advanced features elsewhere
export default account;