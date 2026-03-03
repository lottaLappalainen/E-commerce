import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { AuthApiService } from '../api/auth.api.service';
import { AuthState, AuthUser } from '../models/auth.model';
import { LoggerService } from './logger.service';

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

  constructor(
    private api: AuthApiService,
    private logger: LoggerService
  ) {
    this.initialize();
  }

  private initialize() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      // Jos refresh token löytyy, yritetään kirjata sisään automaattisesti
      this.logger.log('Auth: Found refresh token, attempting auto login');
      this.refresh(refreshToken).subscribe();
    }
  }

  login(data: any) {
    this.logger.log('Auth: Login attempt', data.email);

    return this.api.login(data).pipe(
      tap((response: any) => {
        this.logger.log('Auth: Login successful', response.email);
        this.handleAuthSuccess(response);
      })
    );
  }

  register(data: any) {
    this.logger.log('Auth: Register attempt', data.email);
    return this.api.register(data);
  }

  refresh(refreshToken: string) {
    this.logger.log('Auth: Refreshing token');

    return this.api.refresh(refreshToken).pipe(
      tap((response: any) => {
        this.logger.log('Auth: Token refresh successful');
        this.handleAuthSuccess(response);
      })
    );
  }

  logout() {
    this.logger.log('Auth: User logged out');

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

    this.logger.log('Auth: State updated', user);
  }
}