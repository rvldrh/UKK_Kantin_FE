export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const IMAGE_URL = process.env.NEXT_PUBLIC_IMAGE_URL || 'http://localhost:5000/uploads';

export const TOKEN_KEY = 'ukk_kantin_token';
export const USER_KEY = 'ukk_kantin_user';

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

export const UPLOAD_HEADERS = {
  'Content-Type': 'multipart/form-data',
}; 