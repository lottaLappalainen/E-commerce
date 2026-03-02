import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html'
})
export class ProductDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductsService);
  private cartService = inject(CartService);

  product: Product | null = null;
  loading = true;
  userRole = 'guest';

  ngOnInit(): void {
    const productId = String(this.route.snapshot.paramMap.get('productId'));

    this.productService.fetchProduct(productId).subscribe(product => {
      this.product = product;
      this.loading = false;
    });
  }

  handleAddToCart(): void {
    if (!this.product) return;
    this.cartService.addToCart(this.product);
  }

  handleDelete(): void {
    if (!this.product) return;

    this.productService.deleteProduct(this.product.id).subscribe(() => {
      this.router.navigate(['/products']);
    });
  }

  handleModify(): void {
    if (!this.product) return;
    this.router.navigate(['/products', this.product.id, 'modify']);
  }
}