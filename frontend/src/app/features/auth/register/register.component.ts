import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(10)]],
    passwordConfirmation: ['', Validators.required]
  });

  handleSubmit(): void {

    if (this.form.invalid) {

      if (this.form.controls.password.hasError('minlength')) {
        this.notification.set({
          message: 'Password must be at least 10 characters long',
          stateType: 'auth',
          requestStatus: 'error'
        });
        return;
      }

      if (this.form.controls.name.hasError('minlength')) {
        this.notification.set({
          message: 'Name must be at least 3 characters long',
          stateType: 'auth',
          requestStatus: 'error'
        });
        return;
      }

      this.notification.set({
        message: 'Please fill in all required fields correctly',
        stateType: 'auth',
        requestStatus: 'error'
      });

      return;
    }

    const { passwordConfirmation, ...data } = this.form.getRawValue();

    if (data.password !== passwordConfirmation) {
      this.notification.set({
        message: 'Passwords do not match',
        stateType: 'auth',
        requestStatus: 'error'
      });
      return;
    }

    this.notification.set({
      message: 'Registering...',
      stateType: 'auth',
      requestStatus: 'loading'
    });

    this.authService.register(data).subscribe({
      next: () => {
        this.notification.set({
          message: 'Registration successful! Please login.',
          stateType: 'auth',
          requestStatus: 'success'
        });

        this.router.navigate(['/login']);
      },
      error: (err) => {
        if (err.status === 400) {
          this.notification.set({
            message: 'Email already exists',
            stateType: 'auth',
            requestStatus: 'error'
          });
        } else {
          this.notification.set({
            message: 'Registration failed. Please try again.',
            stateType: 'auth',
            requestStatus: 'error'
          });
        }
      }
    });
  }
}