import { Injectable } from '@angular/core';
import { BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { ProductsApiService } from '../api/products.api.service';
import { Product } from '../models/product.model';
import { NotificationService } from './notification.service';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private productsState = new BehaviorSubject<Product[]>([]);
  products$ = this.productsState.asObservable();

  private productState = new BehaviorSubject<Product | null>(null);
  product$ = this.productState.asObservable();

  constructor(
    private api: ProductsApiService,
    private notification: NotificationService,
    private logger: LoggerService
  ) {}

  fetchProducts() {
    this.logger.log('Products: Fetching all products');

    queueMicrotask(() => {
      this.notification.set({
        message: 'Fetching products...',
        stateType: 'product',
        requestStatus: 'loading'
      });
    });

    return this.api.getProducts().pipe(
      tap(products => {
        this.productsState.next(products);

        this.logger.log('Products: Loaded products', products.length);

        queueMicrotask(() => {
          this.notification.set({
            message: 'Products loaded successfully!',
            stateType: 'product',
            requestStatus: 'success'
          });
        });
      }),
      catchError(error => {
        this.logger.error('Products: Failed to load products', error);

        queueMicrotask(() => {
          this.notification.set({
            message: 'Failed to load products',
            stateType: 'product',
            requestStatus: 'error'
          });
        });

        return throwError(() => error);
      })
    );
  }

  fetchProduct(id: string) {
    this.logger.log('Products: Fetching single product', id);

    return this.api.getProduct(id).pipe(
      tap(product => {
        this.productState.next(product);
        this.logger.log('Products: Product loaded', product);
      })
    );
  }

  addProduct(data: Partial<Product>) {
    this.logger.log('Products: Creating product', data);

    return this.api.addProduct(data).pipe(
      tap(product => {
        this.productsState.next([...this.productsState.value, product]);
        this.logger.log('Products: Product added to state', product);
      })
    );
  }

  deleteProduct(id: string) {
    this.logger.log('Products: Deleting product', id);

    return this.api.deleteProduct(id).pipe(
      tap(() => {
        const updated = this.productsState.value
          .filter(p => p.id !== id);

        this.productsState.next(updated);

        this.logger.log('Products: Product removed from state', id);
      })
    );
  }
}