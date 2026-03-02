import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';

@Component({
  selector: 'app-modify-product',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modify-product.component.html'
})
export class ModifyProductComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productsService = inject(ProductsService);

  productId!: string;

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, Validators.required]
  });

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('productId')!;

    this.productsService.fetchProduct(this.productId)
      .subscribe(product => {
        this.form.patchValue(product);
      });
  }

  handleSubmit() {
    if (this.form.invalid) return;

    this.productsService.addProduct(this.form.getRawValue())
      .subscribe(() => {
        this.router.navigate(['/products', this.productId]);
      });
  }

  handleCancel() {
    this.router.navigate(['/products']);
  }
}