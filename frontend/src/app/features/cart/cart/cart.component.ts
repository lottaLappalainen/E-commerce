import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { CheckoutService } from '../../../core/services/checkout.service';
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
  private checkoutService = inject(CheckoutService);
  private router = inject(Router);

  cartItems$ = this.cartService.cart$;
  authState$ = this.authService.state$;

  handleUpdateQuantity(id: string, quantity: number) {

    // jos määrä menee nollaan → poistetaan tuote
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

    // guest ei saa tehdä tilausta
    if (authState.role === 'guest') {
      this.router.navigate(['/login']);
      return;
    }

    const items = this.cartService.items;

    if (!items.length) return;

    // backend laskee hinnat itse → lähetetään vain productId + quantity
    const checkoutItems = items.map(item => ({
      productId: item.id,
      quantity: item.quantity
    }));

    this.checkoutService.checkout(checkoutItems)
      .subscribe(() => {

        // tyhjennetään ostoskori onnistuneen tilauksen jälkeen
        this.cartService.clearCart();

        this.router.navigate(['/orders']);
      });
  }
}