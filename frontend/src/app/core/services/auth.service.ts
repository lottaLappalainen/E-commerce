import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { AuthApiService } from '../api/auth.api.service';
import { AuthState } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private state = new BehaviorSubject<AuthState>({
    role: 'guest',
    user: null
  });

  state$ = this.state.asObservable();

  constructor(private api: AuthApiService) {}

  checkStatus() {
    return this.api.checkStatus().pipe(
      tap(response => {
        this.state.next({
          role: response.user?.role ?? 'guest',
          user: response.user
        });
      })
    ).subscribe();
  }

  login(data: any) {
    return this.api.login(data).pipe(
      tap((response: any) => {
        this.state.next({
          role: response.user.role,
          user: response.user
        });
      })
    );
  }

  logout() {
    return this.api.logout().pipe(
      tap(() => {
        this.state.next({
          role: 'guest',
          user: null
        });
      })
    );
  }

  register(data: any) {
    return this.api.register(data);
  }
}