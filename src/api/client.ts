import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

// Base URL comes from app.json "extra" so it's not hardcoded in source,
// and can differ between dev/staging/prod builds.
const API_BASE_URL =
  (Constants.expoConfig?.extra?.apiBaseUrl as string) ??
  'https://api.joblinklk.com/api/v1';

const TOKEN_KEY = 'joblink_auth_token';

export const tokenStorage = {
  async get(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
  },
  async set(token: string): Promise<void> {
    // expo-secure-store uses iOS Keychain / Android Keystore under the hood.
    // Never store auth tokens in AsyncStorage or plain state - both are
    // readable on a rooted/jailbroken device or via device backups.
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  },
  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
});

// Attach the bearer token to every request.
api.interceptors.request.use(async (config) => {
  const token = await tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Central place to react to auth failures. The navigation layer subscribes
// to this via `onUnauthorized` so we don't import navigation into the API layer.
let unauthorizedHandler: (() => void) | null = null;
export const setUnauthorizedHandler = (fn: () => void) => {
  unauthorizedHandler = fn;
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      await tokenStorage.clear();
      unauthorizedHandler?.();
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (error.message === 'Network Error') return 'No internet connection.';
  }
  return 'Something went wrong. Please try again.';
};
