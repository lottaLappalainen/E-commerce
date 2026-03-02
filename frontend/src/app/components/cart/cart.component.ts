import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { OrdersService } from '../../core/services/orders.service';
import { CartItem } from '../../core/models/cart-item.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart.component.html'
})
export class CartComponent {

  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private ordersService = inject(OrdersService);
  private router = inject(Router);

  cartItems$ = this.cartService.cart$;
  authState$ = this.authService.state$;

  handleUpdateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      this.cartService.removeFromCart(id);
    } else {
      this.cartService.updateQuantity(id, quantity);
    }
  }

  handleClearCart() {
    this.cartService.clearCart();
  }

  async handleOrder() {
    const authState = await firstValueFrom(this.authState$);

    if (authState.role === 'guest') {
      this.router.navigate(['/login']);
      return;
    }

    const items = this.cartService.items;
    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    this.ordersService.addOrder({
      products: items,
      totalPrice,
      userId: authState.user!.id
    }).subscribe(() => {
      this.cartService.clearCart();
      this.router.navigate(['/orders']);
    });
  }
}