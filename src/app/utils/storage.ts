import { User } from '../types';

export const getStorageItem = (key: string): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

export const setStorageItem = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

export const removeStorageItem = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};

export const clearStorage = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.clear();
  }
};

export const getUser = (): User | null => {
  const userStr = getStorageItem('ukk_kantin_user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setUser = (user: User): void => {
  setStorageItem('ukk_kantin_user', JSON.stringify(user));
}; 