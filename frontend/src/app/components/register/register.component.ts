import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(10)]],
    passwordConfirmation: ['', Validators.required]
  });

  handleSubmit(): void {

    if (this.form.invalid) return;

    const { passwordConfirmation, ...data } = this.form.getRawValue();

    if (data.password !== passwordConfirmation) {
      alert('Passwords do not match');
      return;
    }

    this.authService.register(data)
      .subscribe(() => {
        console.log('Registered');
      });
  }
}