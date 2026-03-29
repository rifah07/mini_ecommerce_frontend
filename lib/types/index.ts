// Auth & Users
export type UserRole = "admin" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

// products
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: string;
}

export interface ProductsPage {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

//Cart

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  priceSnapshot: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

// Orders

export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  priceSnapshot: number;
  subtotal: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  cancelledAt: string | null;
  cancellationReason: string | null;
  createdAt: string;
  user?: User;
}

//API Response wrapper

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: unknown;
}
