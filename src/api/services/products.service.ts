import apiClient, { handleApiError, createFormData } from '../client';
import type {
  ProductEntity,
  CreateProductDto,
} from '@/types/api.types';

class ProductsService {
  /**
   * Get all products
   * Supports filtering by category, search, etc via query params
   */
  async getAllProducts(params?: { category?: string; search?: string }): Promise<ProductEntity[]> {
    try {
      const response = await apiClient.get<ProductEntity[]>('/products', { params });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(id: string): Promise<ProductEntity> {
    try {
      const response = await apiClient.get<ProductEntity>(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create a new product (Supplier only)
   */
  async createProduct(productData: CreateProductDto): Promise<ProductEntity> {
    try {
      const formData = createFormData(productData);
      const response = await apiClient.post<ProductEntity>('/products', formData, {
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
   * Delete product
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new ProductsService();
