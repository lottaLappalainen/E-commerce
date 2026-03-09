import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { CheckoutApiService } from '../api/checkout.api.service';
import { LoggerService } from './logger.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    private api: CheckoutApiService,
    private logger: LoggerService,
    private notification: NotificationService
  ) {}

  checkout(items: any[]) {

    this.logger.log('Checkout: Creating order', items);

    this.notification.set({
      message: 'Placing order...',
      stateType: 'order',
      requestStatus: 'loading'
    });

    return this.api.checkout({ items }).pipe(
      tap(order => {

        this.logger.log('Checkout: Order created', order);

        this.notification.set({
          message: 'Order placed successfully!',
          stateType: 'order',
          requestStatus: 'success'
        });

      })
    );
  }
}