import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../core/services/orders.service';
import { Observable } from 'rxjs';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.component.html'
})
export class OrderDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private ordersService = inject(OrdersService);

  order$!: Observable<Order>;

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id'));

    // haetaan yksittäinen tilaus backendistä
    this.order$ = this.ordersService.fetchOrder(id);
  }
}