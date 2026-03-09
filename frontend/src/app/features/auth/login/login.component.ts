import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);
  private router = inject(Router);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  handleSubmit(): void {

    if (this.form.invalid) return;

    const data = this.form.getRawValue();

    this.notification.set({
      message: 'Logging in...',
      stateType: 'auth',
      requestStatus: 'loading'
    });

    this.authService.login(data).subscribe({
      next: () => {

        this.notification.set({
          message: 'Login successful!',
          stateType: 'auth',
          requestStatus: 'success'
        });

        this.router.navigate(['/']); 
      },
      error: (err) => {

        // 401 = väärä salasana tai email
        if (err.status === 401) {
          this.notification.set({
            message: 'Wrong email or password',
            stateType: 'auth',
            requestStatus: 'error'
          });
        } else {
          // 500 tai muu
          this.notification.set({
            message: 'Login unsuccessful. Please try again.',
            stateType: 'auth',
            requestStatus: 'error'
          });
        }
      }
    });
  }
}