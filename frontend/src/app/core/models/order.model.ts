export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerEmail: string;
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
}