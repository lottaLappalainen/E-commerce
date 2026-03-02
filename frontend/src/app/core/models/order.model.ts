import { Product } from './product.model';

export interface Order {
  id: number;
  userId: number;
  products: Product[];
  totalPrice: number;
  createdAt: string;
}