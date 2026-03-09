import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../../core/services/products.service';
import { CartService } from '../../../core/services/cart.service';
import { Product } from '../../../core/models/product.model';
import { Observable } from 'rxjs';

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

  product$!: Observable<Product>;
  userRole = 'guest';

  ngOnInit(): void {
    const productId = String(this.route.snapshot.paramMap.get('productId'));

    // haetaan yksittäinen tuote backendistä
    this.product$ = this.productService.fetchProduct(productId);
  }

  handleAddToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  handleDelete(product: Product): void {
    this.productService.deleteProduct(product.id).subscribe(() => {
      this.router.navigate(['/products']);
    });
  }

  handleModify(product: Product): void {
    this.router.navigate(['/products', product.id, 'modify']);
  }

}