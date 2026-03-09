import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutApiService {

  private baseUrl = 'http://localhost:5046/api/Checkout/';

  constructor(private http: HttpClient) {}

  checkout(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }
}