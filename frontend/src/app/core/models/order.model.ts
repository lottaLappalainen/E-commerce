import { CartItem } from './cart-item.model';

export interface Order {
  id: string;
  userId: string;
  products: CartItem[];
  totalPrice: number;
  createdAt: string;
}