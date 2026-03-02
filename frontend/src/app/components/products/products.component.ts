import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductFormComponent } from '../product-form/product-form.component';
import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {

  private productService = inject(ProductsService);
  private cartService = inject(CartService);
  private router = inject(Router);

  products: Product[] = [];
  userRole = 'guest';
  isFormVisible = false;

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.fetchProducts()
      .subscribe(data => this.products = data);
  }

  handleInspect(id: string): void {
    this.router.navigate(['/products', id]);
  }

  handleModify(id: string): void {
    this.router.navigate(['/products', id, 'modify']);
  }

  handleDelete(id: string): void {
    this.productService.deleteProduct(id)
      .subscribe(() => this.fetchProducts());
  }

  handleAddToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  handleFormSubmit(formData: Omit<Product, 'id'>): void {
    this.productService.addProduct(formData)
      .subscribe(() => {
        this.fetchProducts();
        this.isFormVisible = false;
      });
  }
}