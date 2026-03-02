import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../core/services/orders.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.component.html'
})
export class OrderDetailsComponent {

  private route = inject(ActivatedRoute);
  private ordersService = inject(OrdersService);

  loading = true;

  readonly order$: Observable<Order> = this.route.paramMap.pipe(
    map(params => params.get('orderId')!),
    switchMap(orderId => this.ordersService.fetchOrder(orderId)),
    tap(() => this.loading = false)
  );
}