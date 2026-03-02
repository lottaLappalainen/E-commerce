import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { UsersApiService } from '../api/users.api.service';
import { User } from '../models/user.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private usersState = new BehaviorSubject<User[]>([]);
  users$ = this.usersState.asObservable();

  private userState = new BehaviorSubject<User | null>(null);
  user$ = this.userState.asObservable();

  constructor(
    private api: UsersApiService,
    private notification: NotificationService
  ) {}

  fetchUsers() {
    this.notification.set({
      message: 'Loading users...',
      stateType: 'user',
      requestStatus: 'loading'
    });

    return this.api.getUsers().pipe(
      tap(users => {
        this.usersState.next(users);
        this.notification.set({
          message: 'Users loaded successfully!',
          stateType: 'user',
          requestStatus: 'success'
        });
      })
    );
  }

  fetchUser(id: string) {
    return this.api.getUser(id).pipe(
      tap(user => this.userState.next(user))
    );
  }

  deleteUser(id: string) {
    return this.api.deleteUser(id).pipe(
      tap(deleted => {
        const updated = this.usersState.value.filter(u => u.id !== deleted.id);
        this.usersState.next(updated);
      })
    );
  }

  modifyUser(id: string, data: any) {
    return this.api.modifyUser(id, data).pipe(
      tap(updatedUser => {
        const updated = this.usersState.value.map(u =>
          u.id === updatedUser.id ? updatedUser : u
        );
        this.usersState.next(updated);
      })
    );
  }
}