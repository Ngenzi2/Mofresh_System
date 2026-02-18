import apiClient, { handleApiError } from '../client';
import type {
  RentalEntity,
  CreateRentalDto,
} from '@/types/api.types';

class RentalsService {
  /**
   * Get all rentals (Admin/Site Manager)
   * Supports filtering by siteId
   */
  async getRentals(params?: { siteId?: string }): Promise<RentalEntity[]> {
    try {
      const response = await apiClient.get<RentalEntity[]>('/rentals', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get all rentals for the current user
   */
  async getMyRentals(): Promise<RentalEntity[]> {
    try {
      const response = await apiClient.get<RentalEntity[]>('/rentals/my-rentals');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get rental by ID
   */
  async getRentalById(id: string): Promise<RentalEntity> {
    try {
      const response = await apiClient.get<RentalEntity>(`/rentals/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create a new rental
   */
  async createRental(rentalData: CreateRentalDto): Promise<RentalEntity> {
    try {
      const response = await apiClient.post<RentalEntity>('/rentals', rentalData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Terminate/Complete rental early
   */
  async completeRental(id: string): Promise<void> {
    try {
      await apiClient.post(`/rentals/${id}/complete`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new RentalsService();
