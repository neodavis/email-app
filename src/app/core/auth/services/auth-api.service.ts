import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import {
  AuthenticationRequest,
  AuthenticationResponse,
  User,
} from '../models/auth.model';
import { API_BASE_URL } from '../../../tokens/base-url.token';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private apiBaseUrl: string,
  ) {}

  signUp(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.apiBaseUrl}/api/v1/auth`, request);
  }

  signIn(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`${this.apiBaseUrl}/api/v1/auth/sign-in`, request);
  }

  validateToken(token: string): Observable<User> {
    return this.http.get<User>(`${this.apiBaseUrl}/api/v1/auth/validate-token/${token}`);
  }
}
