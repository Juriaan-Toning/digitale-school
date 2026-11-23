import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = '/api/auth';

  private isLoggedInKey = 'isLoggedIn';

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(() => {
        localStorage.setItem(this.isLoggedInKey, 'true');
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.isLoggedInKey);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem(this.isLoggedInKey) === 'true';
  }
}
