import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details.component.html'
})
export class UserDetailsComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UsersService);

  user: User | null = null;
  loading = true;

  ngOnInit(): void {
    const userId = String(this.route.snapshot.paramMap.get('userId'));

    this.userService.fetchUser(userId)
      .subscribe(user => {
        this.user = user;
        this.loading = false;
      });
  }

  handleDelete(): void {
    if (!this.user) return;
    if (!confirm('Are you sure?')) return;

    this.userService.deleteUser(this.user.id)
      .subscribe(() => {
        this.router.navigate(['/users']);
      });
  }

  handleModify(): void {
    if (!this.user) return;
    this.router.navigate(['/users', this.user.id, 'modify']);
  }
}