import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthUser } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  private baseUrl = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  checkStatus(): Observable<{ user: AuthUser }> {
    return this.http.get<{ user: AuthUser }>(`${this.baseUrl}/check-status`);
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  logout(): Observable<any> {
    return this.http.get(`${this.baseUrl}/logout`);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }
}