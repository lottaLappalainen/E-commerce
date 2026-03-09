import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UsersService } from '../../../core/services/users.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {

  private userService = inject(UsersService);
  private router = inject(Router);

  users: User[] = [];

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.fetchUsers()
      .subscribe(data => this.users = data);
  }

  handleInspect(id: string): void {
    this.router.navigate(['/users', id]);
  }

  handleModify(id: string): void {
    this.router.navigate(['/users', id, 'modify']);
  }

  handleDelete(id: string): void {
    if (!confirm('Are you sure?')) return;

    this.userService.deleteUser(id)
      .subscribe(() => this.fetchUsers());
  }
}