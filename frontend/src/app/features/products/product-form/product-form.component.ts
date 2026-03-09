import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Product } from '../../../core/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent {

  private fb = inject(FormBuilder);

  @Output() submitForm = new EventEmitter<Omit<Product, 'id'>>();
  @Output() cancel = new EventEmitter<void>();

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    price: [0, Validators.required],
    description: ['', Validators.required]
  });

  handleSubmit(): void {
    if (this.form.invalid) return;

    this.submitForm.emit(this.form.getRawValue());
    this.form.reset();
  }
}