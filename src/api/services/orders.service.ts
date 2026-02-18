import apiClient, { handleApiError } from '../client';
import type {
  OrderEntity,
  CreateOrderDto,
} from '@/types/api.types';

class OrdersService {
  /**
   * Get all orders for the current user
   */
  async getMyOrders(): Promise<OrderEntity[]> {
    try {
      const response = await apiClient.get<OrderEntity[]>('/orders/my-orders');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<OrderEntity> {
    try {
      const response = await apiClient.get<OrderEntity>(`/orders/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Create a new order
   */
  async createOrder(orderData: CreateOrderDto): Promise<OrderEntity> {
    try {
      const response = await apiClient.post<OrderEntity>('/orders', orderData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  /**
   * Cancel order
   */
  async cancelOrder(id: string): Promise<void> {
    try {
      await apiClient.post(`/orders/${id}/cancel`);
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new OrdersService();
