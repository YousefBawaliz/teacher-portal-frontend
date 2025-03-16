import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import AuthService from '../auth.service';
import api from '../api';

// Mock the api module
vi.mock('../api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
  }
}));

describe('AuthService', () => {
  const mockAccessToken = 'mock-access-token';
  const mockRefreshToken = 'mock-refresh-token';
  const mockUser = { id: 1, email: 'test@example.com', role: 'teacher' };

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all mocks
    vi.clearAllMocks();
  });

  describe('login', () => {
    const credentials = { email: 'test@example.com', password: 'password123' };
    const mockLoginResponse = {
      data: {
        access_token: mockAccessToken,
        refresh_token: mockRefreshToken,
        user: mockUser
      }
    };

    it('should successfully login and store tokens', async () => {
      // Mock the API response
      vi.mocked(api.post).mockResolvedValueOnce(mockLoginResponse);

      // Perform login
      const response = await AuthService.login(credentials);

      // Verify API was called correctly
      expect(api.post).toHaveBeenCalledWith('/api/auth/login', credentials);

      // Verify tokens were stored
      expect(localStorage.getItem('access_token')).toBe(mockAccessToken);
      expect(localStorage.getItem('refresh_token')).toBe(mockRefreshToken);

      // Verify response
      expect(response).toEqual(mockLoginResponse.data);
    });

    it('should throw error on failed login', async () => {
      const errorMessage = 'Invalid credentials';
      vi.mocked(api.post).mockRejectedValueOnce(new Error(errorMessage));

      await expect(AuthService.login(credentials))
        .rejects.toThrow(errorMessage);

      // Verify no tokens were stored
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear tokens on successful logout', async () => {
      // Setup initial tokens
      localStorage.setItem('access_token', mockAccessToken);
      localStorage.setItem('refresh_token', mockRefreshToken);

      vi.mocked(api.post).mockResolvedValueOnce({ data: { message: 'Logged out' } });

      await AuthService.logout();

      expect(api.post).toHaveBeenCalledWith('/api/auth/logout');
      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
    });

    it('should clear tokens even if logout API fails', async () => {
      localStorage.setItem('access_token', mockAccessToken);
      localStorage.setItem('refresh_token', mockRefreshToken);

      vi.mocked(api.post).mockRejectedValueOnce(new Error('Network error'));

      await expect(AuthService.logout()).rejects.toThrow('Network error');

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh access token', async () => {
      const newAccessToken = 'new-access-token';
      localStorage.setItem('refresh_token', mockRefreshToken);

      vi.mocked(api.post).mockResolvedValueOnce({
        data: { access_token: newAccessToken }
      });

      const result = await AuthService.refreshToken();

      expect(api.post).toHaveBeenCalledWith('/api/auth/refresh', {
        refresh_token: mockRefreshToken
      });
      expect(result).toBe(newAccessToken);
      expect(localStorage.getItem('access_token')).toBe(newAccessToken);
    });

    it('should throw error if no refresh token available', async () => {
      await expect(AuthService.refreshToken())
        .rejects.toThrow('No refresh token available');
    });
  });

  describe('getCurrentUser', () => {
    it('should fetch current user successfully', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: mockUser });

      const user = await AuthService.getCurrentUser();

      expect(api.get).toHaveBeenCalledWith('/api/users/me');
      expect(user).toEqual(mockUser);
    });
  });

  describe('token management', () => {
    it('should correctly manage tokens in localStorage', () => {
      AuthService.setTokens(mockAccessToken, mockRefreshToken);
      
      expect(AuthService.getAccessToken()).toBe(mockAccessToken);
      expect(AuthService.getRefreshToken()).toBe(mockRefreshToken);
      expect(AuthService.isAuthenticated()).toBe(true);

      AuthService.clearTokens();
      
      expect(AuthService.getAccessToken()).toBeNull();
      expect(AuthService.getRefreshToken()).toBeNull();
      expect(AuthService.isAuthenticated()).toBe(false);
    });
  });
});