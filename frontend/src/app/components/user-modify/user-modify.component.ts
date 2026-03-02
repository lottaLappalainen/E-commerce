import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { UsersService } from '../../core/services/users.service';

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

  form = this.fb.nonNullable.group({
    name: [''],
    role: ['']
  });

  ngOnInit(): void {
    this.userId = String(this.route.snapshot.paramMap.get('userId'));

    this.userService.fetchUser(this.userId)
      .subscribe(user => {
        this.form.patchValue(user);
      });
  }

  handleSubmit(): void {
    this.userService.modifyUser(this.userId, this.form.getRawValue())
      .subscribe(() => {
        this.router.navigate(['/users', this.userId]);
      });
  }

  handleCancel(): void {
    this.router.navigate(['/users', this.userId]);
  }
}