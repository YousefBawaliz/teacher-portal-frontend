import api from './api';

import type { 
  LoginRequest, 
  LoginResponse, 
  RefreshTokenResponse, 
  User, 
  ApiResponse 
} from '@/types/api.types';

export class AuthService {
  private static TOKEN_KEY = 'access_token';
  private static REFRESH_TOKEN_KEY = 'refresh_token';

  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/api/auth/login', credentials);
    const { access_token, refresh_token } = response.data;
    
    this.setTokens(access_token, refresh_token);
    return response.data;
  }

  static async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await api.post<ApiResponse<void>>('/api/auth/logout');
      this.clearTokens();
      return response.data;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  static async refreshToken(): Promise<string> {
    const refresh_token = this.getRefreshToken();
    if (!refresh_token) {
      throw new Error('No refresh token available');
    }
  
    // Set refresh token in Authorization header
    api.defaults.headers.common['Authorization'] = `Bearer ${refresh_token}`;
    
    const response = await api.post<RefreshTokenResponse>('/api/auth/refresh');
    
    // Reset Authorization header to access token
    const { access_token } = response.data;
    api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
    
    this.setAccessToken(access_token);
    return access_token;
  }

  static async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/api/users/me');
    return response.data;
  }

  // Token management methods
  static setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  static setAccessToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export default AuthService;