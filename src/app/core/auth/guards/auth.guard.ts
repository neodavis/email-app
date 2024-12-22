import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthApiService } from '../services/auth-api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authApiService: AuthApiService, 
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    if (localStorage.getItem('token')) {
      return this.authApiService.validateToken(localStorage.getItem('token')!)
          .pipe(
            take(1),
            map(isAuthenticated => {
              if (!isAuthenticated) {
                this.router.navigate(['/auth/sign-in']);

                return false;
              }
              return true;
            })
          )
    } else {
      this.router.navigate(['/auth/sign-in']);

      return of(false);
    }
  }
}