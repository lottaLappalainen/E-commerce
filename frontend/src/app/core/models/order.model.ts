import { CartItem } from './cart-item.model';

export interface Order {
  id: number;
  userId: string;
  products: CartItem[];
  totalPrice: number;
  createdAt: string;
}