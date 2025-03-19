import api from './api';
import type { User, ApiResponse } from '@/types/api.types';

export interface UpdateUserProfile {
  first_name?: string;
  last_name?: string;
  email?: string;
  theme_preference?: string;
  profile_image?: string;
  password?: string;
}

export class UserService {
  static async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/api/users/me');
    return response.data;
  }

  static async updateProfile(data: UpdateUserProfile): Promise<User> {
    const response = await api.put<User>('/api/users/me', data);
    return response.data;
  }

  static async getAllUsers(page = 1, perPage = 10): Promise<ApiResponse<User[]>> {
    const response = await api.get<ApiResponse<User[]>>('/api/users', {
      params: { page, per_page: perPage }
    });
    return response.data;
  }
}

export default UserService;
