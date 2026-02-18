import apiClient, { handleApiError, createFormData } from '../client';
import type {
  UserEntity,
  CreateUserDto,
  UpdateUserDto,
} from '@/types/api.types';

class UsersService {
  /**
   * Register a new user
   * Supports file uploads for documents
   */
  async register(userData: CreateUserDto): Promise<UserEntity> {
    try {
      const formData = createFormData(userData);

      const response = await apiClient.post<UserEntity>('/users/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get all users
   */
  async getAllUsers(): Promise<UserEntity[]> {
    try {
      const response = await apiClient.get<UserEntity[]>('/users');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<UserEntity> {
    try {
      const response = await apiClient.get<UserEntity>(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update user details
   */
  async updateUser(id: string, userData: UpdateUserDto): Promise<UserEntity> {
    try {
      const formData = createFormData(userData);

      const response = await apiClient.patch<UserEntity>(`/users/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Soft delete user
   */
  async deleteUser(id: string): Promise<void> {
    try {
      await apiClient.delete(`/users/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new UsersService();
