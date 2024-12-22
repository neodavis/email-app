import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  AuthenticationRequest, 
  AuthenticationResponse, 
  User 
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  constructor(private http: HttpClient) {}

  signUp(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`/api/v1/auth`, request);
  }

  signIn(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>(`/api/v1/auth/sign-in`, request);
  }

  validateToken(token: string): Observable<User> {
    return this.http.get<User>(`/api/v1/auth/validate-token/${token}`);
  }
}