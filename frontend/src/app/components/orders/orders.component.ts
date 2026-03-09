import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrdersService } from '../../core/services/orders.service';
import { AuthService } from '../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {

  private ordersService = inject(OrdersService);
  private authService = inject(AuthService);
  private router = inject(Router);

  orders$ = this.ordersService.orders$;

  async ngOnInit() {

    const authState = await firstValueFrom(this.authService.state$);

    if (authState.role === 'Admin') {
      this.ordersService.fetchOrders().subscribe();
    } else {
      this.ordersService.fetchMyOrders().subscribe();
    }

  }

  handleInspectOrder(orderId: string) {
    this.router.navigate(['/orders', orderId]);
  }
}