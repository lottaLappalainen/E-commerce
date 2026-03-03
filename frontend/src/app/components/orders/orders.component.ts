import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrdersService } from '../../core/services/orders.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit {

  private ordersService = inject(OrdersService);
  private router = inject(Router);

  orders$ = this.ordersService.orders$;

  ngOnInit() {
    this.ordersService.fetchOrders().subscribe();
  }

  handleInspectOrder(orderId: string) {
    this.router.navigate(['/orders', orderId]);
  }
}