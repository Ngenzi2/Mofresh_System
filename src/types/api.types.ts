// API Types based on Mofresh Backend API
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  SITE_MANAGER = 'SITE_MANAGER',
  SUPPLIER = 'SUPPLIER',
  CLIENT = 'CLIENT',
}

export enum ClientAccountType {
  PERSONAL = 'PERSONAL',
  BUSINESS = 'BUSINESS',
}

export enum InvoiceStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  VOID = 'VOID',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  SUCCESSFUL = 'SUCCESSFUL',
  FAILED = 'FAILED',
  PAID = 'PAID',
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

// Auth Types
export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  message?: string;
  otpRequired?: boolean;
  accessToken?: string;
  refreshToken?: string;
  user?: UserEntity;
}

export interface VerifyOtpDto {
  email: string;
  code: string;
}

export interface VerifyOtpResponse {
  accessToken: string;
  refreshToken: string;
  user: UserEntity;
}

export interface ResendOtpDto {
  email: string;
}

export interface RequestPasswordResetDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  code: string;
  newPassword: string;
}

// User Types
export interface UserEntity {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  siteId: string | null;
  isActive: boolean;
  clientAccountType: ClientAccountType | null;
  businessName: string | null;
  tinNumber: string | null;
  businessCertificateDocument: string | null;
  nationalIdDocument: string | null;
  profilePicture: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateUserDto {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  siteId?: string;
  clientAccountType?: ClientAccountType;
  businessName?: string;
  tinNumber?: string;
  businessCertificateDocument?: File;
  nationalIdDocument?: File;
  avatar?: File;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  isActive?: boolean;
  role?: UserRole;
  password?: string;
  siteId?: string;
  clientAccountType?: ClientAccountType;
  businessName?: string;
  tinNumber?: string;
  businessCertificateDocument?: File;
  nationalIdDocument?: File;
  avatar?: File;
}

// Site Types
export interface SiteEntity {
  id: string;
  name: string;
  location: string;
  managerId: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CreateSiteDto {
  name: string;
  location: string;
  managerId?: string;
}

export interface UpdateSiteDto {
  name?: string;
  location?: string;
  managerId?: string;
}

// Invoice Types
export interface InvoiceItemResponseDto {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
}

export interface InvoiceResponseDto {
  id: string;
  invoiceNumber: string;
  orderId: string | null;
  rentalId: string | null;
  clientId: string;
  siteId: string;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: InvoiceStatus;
  dueDate: string;
  items: InvoiceItemResponseDto[];
  createdAt: string;
  updatedAt: string;
}

export interface GenerateOrderInvoiceDto {
  orderId: string;
  dueDate?: string;
}

export interface GenerateRentalInvoiceDto {
  rentalId: string;
  dueDate?: string;
}

export interface MarkPaidDto {
  paymentAmount: number;
}

export interface VoidInvoiceDto {
  reason: string;
}

// Payment Types
export interface InitiatePaymentDto {
  invoiceId: string;
  phoneNumber: string;
}

export interface PaymentEntity {
  id: string;
  invoiceId: string;
  amount: number;
  status: PaymentStatus;
  transactionRef: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

// Audit Log Types
export interface CreateAuditLogDto {
  entityType: string;
  entityId: string;
  action: AuditAction;
  userId: string;
  details?: Record<string, any>;
  timestamp?: string;
}

export interface AuditLogEntity {
  id: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  userId: string;
  details: Record<string, any>;
  timestamp: string;
  user: UserEntity;
}

// Report Types
export interface RevenueReportFilters {
  startDate?: string;
  endDate?: string;
  siteId?: string;
}

export interface UnpaidInvoicesFilters {
  siteId?: string;
  overdue?: boolean;
  page?: number;
  limit?: number;
}

// Product Types
export interface ProductEntity {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  stockQuantity: number;
  image: string;
  category: string;
  supplierId: string;
  discount?: number;
  rating?: number;
  badge?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  unit: string;
  stockQuantity: number;
  category: string;
  image?: File;
}

// Order Types
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  READY_FOR_PICKUP = 'READY_FOR_PICKUP',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItemEntity {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: ProductEntity;
}

export interface OrderEntity {
  id: string;
  clientId: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItemEntity[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  items: { productId: string; quantity: number }[];
}

// Rental Types
export enum RentalStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE',
}

export interface RentalEntity {
  id: string;
  clientId: string;
  assetName: string; // e.g., "Smart Box 50L"
  hubLocation: string;
  startDate: string;
  endDate: string;
  status: RentalStatus;
  totalPrice: number;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRentalDto {
  assetName: string;
  hubLocation: string;
  startDate: string;
  endDate: string;
  quantity: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Error Response
export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
