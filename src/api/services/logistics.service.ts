import apiClient, { handleApiError } from '../client';
import type {
  TricycleEntity,
  ColdBoxEntity,
  ColdPlateEntity,
  CreateTricycleDto,
  CreateColdBoxDto,
  CreateColdPlateDto,
  AssetStatus,
} from '@/types/api.types';

class LogisticsService {
  /**
   * Tricycle Operations
   */
  async createTricycle(data: CreateTricycleDto): Promise<TricycleEntity> {
    try {
      const response = await apiClient.post<TricycleEntity>('/cold-assets/tricycles', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getTricycles(): Promise<TricycleEntity[]> {
    try {
      const response = await apiClient.get<any>('/cold-assets/tricycles');
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.data)) return response.data.data;
      return [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Public tricycle listing — no auth required.
   * Uses: GET /api/v1/cold-assets/tricycles/public
   */
  async getPublicTricycles(): Promise<TricycleEntity[]> {
    try {
      const response = await apiClient.get<any>('/cold-assets/tricycles/public');
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.data)) return response.data.data;
      return [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Public tricycle listing without filters — no auth required.
   * Uses: GET /api/v1/cold-assets/tricycles/all/public
   */
  async getAllPublicTricycles(): Promise<TricycleEntity[]> {
    try {
      const response = await apiClient.get<any>('/cold-assets/tricycles/all/public');
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.data)) return response.data.data;
      return [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Cold Box Operations
   */
  async createColdBox(data: CreateColdBoxDto): Promise<ColdBoxEntity> {
    try {
      const response = await apiClient.post<ColdBoxEntity>('/cold-assets/boxes', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getColdBoxes(): Promise<ColdBoxEntity[]> {
    try {
      const response = await apiClient.get<ColdBoxEntity[]>('/cold-assets/boxes');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Cold Plate Operations
   */
  async createColdPlate(data: CreateColdPlateDto): Promise<ColdPlateEntity> {
    try {
      const response = await apiClient.post<ColdPlateEntity>('/cold-assets/plates', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getColdPlates(): Promise<ColdPlateEntity[]> {
    try {
      const response = await apiClient.get<ColdPlateEntity[]>('/cold-assets/plates');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Shared Operations
   */
  async updateAssetStatus(type: 'tricycles' | 'boxes' | 'plates', id: string, status: AssetStatus): Promise<void> {
    try {
      await apiClient.patch(`/cold-assets/${type}/${id}/status`, { status });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async deleteAsset(type: 'tricycles' | 'boxes' | 'plates', id: string): Promise<void> {
    try {
      await apiClient.delete(`/cold-assets/${type}/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new LogisticsService();
