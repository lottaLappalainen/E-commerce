import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { OrdersApiService } from '../api/orders.api.service';
import { Order } from '../models/order.model';
import { NotificationService } from './notification.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private ordersState = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersState.asObservable();

  private orderState = new BehaviorSubject<Order | null>(null);
  order$ = this.orderState.asObservable();

  constructor(
    private api: OrdersApiService,
    private notification: NotificationService,
    private logger: LoggerService
  ) {}

  fetchOrders() {
    this.logger.log('Orders: Fetching all orders');

    this.notification.set({
      message: 'Fetching orders...',
      stateType: 'order',
      requestStatus: 'loading'
    });

    return this.api.getOrders().pipe(
      tap(orders => {
        this.ordersState.next(orders);

        this.logger.log('Orders: Orders loaded', orders.length);

        this.notification.set({
          message: 'Orders loaded successfully!',
          stateType: 'order',
          requestStatus: 'success'
        });
      })
    );
  }

  fetchOrder(id: string) {
    this.logger.log('Orders: Fetching single order', id);

    return this.api.getOrder(id).pipe(
      tap(order => {
        this.orderState.next(order);
        this.logger.log('Orders: Order loaded', order);
      })
    );
  }

  addOrder(data: Partial<Order>) {
    this.logger.log('Orders: Creating order', data);

    return this.api.addOrder(data).pipe(
      tap(order => {
        this.ordersState.next([...this.ordersState.value, order]);
        this.logger.log('Orders: Order added to state', order);
      })
    );
  }
}