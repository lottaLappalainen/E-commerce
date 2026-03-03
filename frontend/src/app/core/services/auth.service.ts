import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { AuthApiService } from '../api/auth.api.service';
import { AuthState, AuthUser } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private state = new BehaviorSubject<AuthState>({
    role: 'guest',
    user: null,
    accessToken: null
  });

  state$ = this.state.asObservable();

  constructor(private api: AuthApiService) {
    this.initialize();
  }

  private initialize() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      this.refresh(refreshToken).subscribe();
    }
  }

  login(data: any) {
    return this.api.login(data).pipe(
      tap((response: any) => {
        this.handleAuthSuccess(response);
      })
    );
  }

  register(data: any) {
    return this.api.register(data);
  }

  refresh(refreshToken: string) {
    return this.api.refresh(refreshToken).pipe(
      tap((response: any) => {
        this.handleAuthSuccess(response);
      })
    );
  }

  logout() {
    localStorage.removeItem('refreshToken');

    this.state.next({
      role: 'guest',
      user: null,
      accessToken: null
    });
  }

  private handleAuthSuccess(response: any) {

    const user: AuthUser = {
      id: response.id,
      name: response.name,
      email: response.email,
      role: response.role
    };

    localStorage.setItem('refreshToken', response.refreshToken);

    this.state.next({
      role: user.role,
      user,
      accessToken: response.accessToken
    });
  }
}