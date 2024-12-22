import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthApiService } from './auth-api.service';
import { User, AuthenticationResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.currentUser$.pipe(
    map(user => !!user)
  );

  constructor(
    private authApiService: AuthApiService,
    private router: Router
  ) {
    this.initializeFromStorage();
  }

  private initializeFromStorage() {
    const token = localStorage.getItem('token');
    if (token) {
      this.authApiService.validateToken(token).subscribe({
        next: (user) => this.currentUserSubject.next(user),
      });
    }
  }

  signIn(login: string, password: string): Observable<AuthenticationResponse> {
    return this.authApiService.signIn({ login, password }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        this.validateAndSetUser(response.token);
      })
    );
  }

  signUp(login: string, password: string): Observable<AuthenticationResponse> {
    return this.authApiService.signUp({ login, password });
  }

  private validateAndSetUser(token: string): void {
    this.authApiService.validateToken(token).subscribe({
      next: (user) => this.currentUserSubject.next(user),
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/sign-in']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.getValue();
  }
}