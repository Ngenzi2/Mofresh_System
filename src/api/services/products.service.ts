import apiClient, { handleApiError } from '../client';
import type {
  ProductEntity,
  CreateProductDto,
  AdjustStockDto,
} from '@/types/api.types';

class ProductsService {
  /**
   * List all products with site-specific filtering (authenticated)
   */
  async getAllProducts(params?: { siteId?: string; category?: string }): Promise<ProductEntity[]> {
    try {
      const response = await apiClient.get<any>('/products', { params });
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Public product listing — no auth required.
   * Uses: GET /api/v1/products/all/public
   * Optional client-side category filter applied after fetch.
   */
  async getPublicProducts(params?: { category?: string }): Promise<ProductEntity[]> {
    try {
      const response = await apiClient.get<any>('/products/all/public');
      let products: ProductEntity[] = [];

      if (Array.isArray(response.data)) {
        products = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        products = response.data.data;
      }

      // Filter by category client-side if the public endpoint doesn't support it
      if (params?.category) {
        products = products.filter(
          p => p.category?.toLowerCase() === params.category!.toLowerCase()
        );
      }

      return products;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Site-specific product discovery — authenticated.
   * Uses: GET /api/v1/products/discovery
   * Supports siteId, category, and pagination filters.
   */
  async getDiscoveryProducts(params?: {
    siteId?: string;
    category?: string;
    page?: number;
    limit?: number;
  }): Promise<ProductEntity[]> {
    try {
      const response = await apiClient.get<any>('/products/discovery', { params });
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.data)) return response.data.data;
      return [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Single product detail via discovery route.
   * Uses: GET /api/v1/products/discovery/{id}
   */
  async getDiscoveryProductById(id: string): Promise<ProductEntity> {
    try {
      const response = await apiClient.get<any>(`/products/discovery/${id}`);
      return response.data?.data ?? response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Full product detail — authenticated.
   * Uses: GET /api/v1/products/{id}
   * Falls back to discovery/{id} if this returns 403.
   */
  async getProductById(id: string): Promise<ProductEntity> {
    try {
      const response = await apiClient.get<any>(`/products/${id}`);
      return response.data?.data ?? response.data;
    } catch (error) {
      // If forbidden, fall back to the discovery route
      try {
        const fallback = await apiClient.get<any>(`/products/discovery/${id}`);
        return fallback.data?.data ?? fallback.data;
      } catch {
        throw new Error(handleApiError(error));
      }
    }
  }

  /**
   * Register a new agricultural product
   */
  async createProduct(productData: CreateProductDto): Promise<ProductEntity> {
    try {
      const response = await apiClient.post<ProductEntity>('/products', productData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Update product metadata
   */
  async updateProduct(id: string, productData: Partial<CreateProductDto>): Promise<ProductEntity> {
    try {
      const response = await apiClient.patch<ProductEntity>(`/products/${id}`, productData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Soft delete a product
   */
  async deleteProduct(id: string): Promise<void> {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Adjust product stock levels (IN/OUT movements)
   */
  async adjustStock(id: string, data: AdjustStockDto): Promise<void> {
    try {
      await apiClient.patch(`/products/${id}/adjust-stock`, data);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get stock movements for a specific site or product
   */
  async getStockMovements(params?: { siteId?: string; productId?: string }): Promise<any[]> {
    try {
      const response = await apiClient.get<any>('/products/movements', { params });
      if (response.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new ProductsService();
