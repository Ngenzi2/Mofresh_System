import apiClient, { handleApiError } from '../client';
import type {
  OrderEntity,
  CreateOrderDto,
  OrderStatus,
} from '@/types/api.types';

class OrdersService {
  /**
   * Create a new order
   * POST /api/v1/orders
   * Body: { deliveryAddress, notes?, items: [{ productId, quantityKg }] }
   */
  async createOrder(orderData: CreateOrderDto): Promise<OrderEntity> {
    try {
      const response = await apiClient.post<any>('/orders', orderData);
      return response.data?.data ?? response.data;
    } catch (error) {
      throw error; // rethrow raw for status code inspection
    }
  }

  /**
   * Get all orders with server-side status filter + pagination
   * GET /api/v1/orders?status=...&page=...&limit=...
   */
  async getAllOrders(params?: {
    status?: OrderStatus;
    page?: number;
    limit?: number;
  }): Promise<{ orders: OrderEntity[]; total: number; page: number; limit: number }> {
    try {
      // Strip undefined values so they don't show up as "undefined" in query
      const cleanParams: Record<string, string | number> = {};
      if (params?.status) cleanParams.status = params.status;
      if (params?.page) cleanParams.page = params.page;
      if (params?.limit) cleanParams.limit = params.limit;

      const response = await apiClient.get<any>('/orders', {
        params: Object.keys(cleanParams).length ? cleanParams : undefined,
      });

      const raw = response.data;

      // Handle both wrapped { data: [...], total, page, limit } and raw array
      if (Array.isArray(raw)) {
        return { orders: raw, total: raw.length, page: 1, limit: raw.length };
      }
      if (Array.isArray(raw?.data)) {
        return {
          orders: raw.data,
          total: raw.total ?? raw.data.length,
          page: raw.page ?? 1,
          limit: raw.limit ?? raw.data.length,
        };
      }
      return { orders: [], total: 0, page: 1, limit: 10 };
    } catch (error) {
      throw error; // rethrow raw
    }
  }

  /**
   * Get a single order by ID
   * GET /api/v1/orders/{id}
   */
  async getOrderById(id: string): Promise<OrderEntity> {
    try {
      const response = await apiClient.get<any>(`/orders/${id}`);
      return response.data?.data ?? response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Delete / cancel an order (only REQUESTED orders)
   * DELETE /api/v1/orders/{id}
   */
  async deleteOrder(id: string): Promise<void> {
    try {
      await apiClient.delete(`/orders/${id}`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Approve an order (admin/manager only)
   * PATCH /api/v1/orders/{id}/approve
   */
  async approveOrder(id: string): Promise<void> {
    try {
      await apiClient.patch(`/orders/${id}/approve`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Reject an order with a reason (admin/manager only)
   * PATCH /api/v1/orders/{id}/reject
   */
  async rejectOrder(id: string, rejectionReason: string): Promise<void> {
    try {
      await apiClient.patch(`/orders/${id}/reject`, { rejectionReason });
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new OrdersService();
