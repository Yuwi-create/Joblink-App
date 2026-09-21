import { create } from 'zustand';
import { User } from '@/types';
import { tokenStorage } from '@/api/client';
import * as authApi from '@/api/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  bootstrap: () => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  register: (name: string, phone: string, password: string, role: User['role']) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  // Called once on app start to check for an existing session.
  bootstrap: async () => {
    set({ isLoading: true });
    const token = await tokenStorage.get();
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }
    try {
      const user = await authApi.fetchCurrentUser();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      await tokenStorage.clear();
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (phone, password) => {
    const user = await authApi.login({ phone, password });
    set({ user, isAuthenticated: true });
  },

  register: async (name, phone, password, role) => {
    const user = await authApi.register({ name, phone, password, role });
    set({ user, isAuthenticated: true });
  },

  logout: async () => {
    await authApi.logout();
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user }),
}));
