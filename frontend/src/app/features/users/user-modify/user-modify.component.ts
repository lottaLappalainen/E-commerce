import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { UsersService } from '../../../core/services/users.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-modify',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-modify.component.html'
})
export class UserModifyComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UsersService);

  userId!: string;
  user: User | null = null;

  form = this.fb.nonNullable.group({
    role: ['']
  });

  ngOnInit(): void {

    const id = this.route.snapshot.paramMap.get('userId');

    if (!id) {
      console.error('User ID missing in route');
      return;
    }

    this.userId = id;

    this.userService.fetchUser(this.userId)
      .subscribe(user => {

        this.user = user;

        this.form.patchValue({
          role: user.role
        });

      });

  }

  handleSubmit(): void {

    const role = this.form.value.role;

    if (!role) return;

    this.userService.modifyUser(this.userId, role)
      .subscribe(() => {
        this.router.navigate(['/users', this.userId]);
      });

  }

  handleCancel(): void {
    this.router.navigate(['/users', this.userId]);
  }

}