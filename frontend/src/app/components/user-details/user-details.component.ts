import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../core/services/users.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-inspect',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details.component.html'
})
export class UserDetailsComponent implements OnInit {

  private usersService = inject(UsersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  user: User | null = null;
  loading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading = false;
      return;
    }

    this.usersService.fetchUser(id)
      .subscribe(user => {
        this.user = user;
        this.loading = false;
      });
  }

  handleModify(): void {
    if (!this.user) return;
    this.router.navigate(['/users', this.user.id, 'modify']);
  }

  handleDelete(): void {
    if (!this.user) return;
    if (!confirm('Are you sure?')) return;

    this.usersService.deleteUser(this.user.id)
      .subscribe(() => {
        this.router.navigate(['/users']);
      });
  }

}