import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartState = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartState.asObservable();

  constructor(private logger: LoggerService) {}

  get items(): CartItem[] {
    return this.cartState.value;
  }

  addToCart(product: Product) {
    this.logger.log('Cart: Adding product', product);

    const existing = this.items.find(p => p.id === product.id);

    if (existing) {
      const updated = this.items.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      this.cartState.next(updated);
    } else {
      this.cartState.next([
        ...this.items,
        { ...product, quantity: 1 }
      ]);
    }
  }

  removeFromCart(productId: string) {
    this.logger.log('Cart: Removing product', productId);

    const updated = this.items.filter(p => p.id !== productId);
    this.cartState.next(updated);
  }

  updateQuantity(productId: string, quantity: number) {
    this.logger.log('Cart: Updating quantity', { productId, quantity });

    const updated = this.items.map(item =>
      item.id === productId
        ? { ...item, quantity }
        : item
    );
    this.cartState.next(updated);
  }

  clearCart() {
    this.logger.log('Cart: Clearing cart');
    this.cartState.next([]);
  }
}