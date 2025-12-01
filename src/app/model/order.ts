import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
  specialInstructions?: string;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface Order {
  idOrder?: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: CartItem[];
  totalAmount: number;
  orderType: 'delivery' | 'pickup'; // domicilio o recojo
  deliveryAddress?: string;
  specialInstructions?: string;
  orderDate: Date;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  estimatedTime?: number; // tiempo estimado en minutos
}