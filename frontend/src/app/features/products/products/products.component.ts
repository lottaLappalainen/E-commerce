import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductsService } from '../../../core/services/products.service';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsComponent implements OnInit {

  private productService = inject(ProductsService);
  private cartService = inject(CartService);
  private router = inject(Router);

  products$ = this.productService.products$;

  userRole = 'guest';
  isFormVisible = false;

  ngOnInit(): void {
    this.productService.fetchProducts().subscribe();
  }

  handleInspect(id: string): void {
    this.router.navigate(['/products', id]);
  }

  handleModify(id: string): void {
    this.router.navigate(['/products', id, 'modify']);
  }

  handleDelete(id: string): void {
    this.productService.deleteProduct(id)
      .subscribe(() => this.productService.fetchProducts().subscribe());
  }

  handleAddToCart(product: any): void {
    this.cartService.addToCart(product);
  }

  handleFormSubmit(formData: any): void {
    this.productService.addProduct(formData)
      .subscribe(() => {
        this.productService.fetchProducts().subscribe();
        this.isFormVisible = false;
      });
  }
}