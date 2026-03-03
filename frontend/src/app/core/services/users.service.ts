import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { UsersApiService } from '../api/users.api.service';
import { User } from '../models/user.model';
import { NotificationService } from './notification.service';
import { LoggerService } from './logger.service';

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
    private notification: NotificationService,
    private logger: LoggerService
  ) {}

  fetchUsers() {
    this.logger.log('Users: Fetching all users');

    this.notification.set({
      message: 'Loading users...',
      stateType: 'user',
      requestStatus: 'loading'
    });

    return this.api.getUsers().pipe(
      tap(users => {
        this.usersState.next(users);

        this.logger.log('Users: Users loaded', users.length);

        this.notification.set({
          message: 'Users loaded successfully!',
          stateType: 'user',
          requestStatus: 'success'
        });
      })
    );
  }

  fetchUser(id: string) {
    this.logger.log('Users: Fetching single user', id);

    return this.api.getUser(id).pipe(
      tap(user => {
        this.userState.next(user);
        this.logger.log('Users: User loaded', user);
      })
    );
  }

  deleteUser(id: string) {
    this.logger.log('Users: Deleting user', id);

    return this.api.deleteUser(id).pipe(
      tap(deleted => {
        const updated = this.usersState.value.filter(u => u.id !== deleted.id);
        this.usersState.next(updated);

        this.logger.log('Users: User removed from state', deleted.id);
      })
    );
  }

  modifyUser(id: string, data: any) {
    this.logger.log('Users: Modifying user', { id, data });

    return this.api.modifyUser(id, data).pipe(
      tap(updatedUser => {
        const updated = this.usersState.value.map(u =>
          u.id === updatedUser.id ? updatedUser : u
        );

        this.usersState.next(updated);

        this.logger.log('Users: User updated in state', updatedUser);
      })
    );
  }
}