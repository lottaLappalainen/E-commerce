import { Injectable } from '@angular/core';
import { BehaviorSubject, tap, finalize, catchError, throwError } from 'rxjs';
import { ProductsApiService } from '../api/products.api.service';
import { Product } from '../models/product.model';
import { NotificationService } from './notification.service';

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
    private notification: NotificationService
  ) {}

  fetchProducts() {
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

        queueMicrotask(() => {
          this.notification.set({
            message: 'Products loaded successfully!',
            stateType: 'product',
            requestStatus: 'success'
          });
        });
      }),
      catchError(error => {
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
    return this.api.getProduct(id).pipe(
      tap(product => this.productState.next(product))
    );
  }

  addProduct(data: Partial<Product>) {
    return this.api.addProduct(data).pipe(
      tap(product => {
        this.productsState.next([...this.productsState.value, product]);
      })
    );
  }

  deleteProduct(id: string) {
    return this.api.deleteProduct(id).pipe(
      tap(() => {
        const updated = this.productsState.value
          .filter(p => p.id !== id);

        this.productsState.next(updated);
      })
    );
  }
}