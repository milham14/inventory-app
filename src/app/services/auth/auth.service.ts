import { Injectable, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, fromEvent, merge } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private inactivityTimeoutId: any;
  private inactivityTime = 15 * 60 * 1000; // 1 menit (ubah sesuai kebutuhan)
  private apiUrl = 'http://127.0.0.1:8000/api';

  private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isLoggedIn());
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private ngZone: NgZone
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.initInactivityListener(); // mulai pantau aktivitas
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        if (response.status === 'success') {
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('user', JSON.stringify(response.admin));
            localStorage.setItem('token', response.token);
          }
          this.loggedInSubject.next(true);
          this.resetInactivityTimer(); // mulai/reset timer
        }
      })
    );
  }

  logout(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.clearSession();
      return;
    }

    this.http.post(`${this.apiUrl}/logout`, {}, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: () => this.clearSession(),
      error: () => this.clearSession()
    });
  }

  private clearSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }

    if (this.inactivityTimeoutId) {
      clearTimeout(this.inactivityTimeoutId);
      this.inactivityTimeoutId = null;
    }

    this.loggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getUser(): any {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  public checkTokenValidity(): Observable<boolean> {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        return this.http.get(`${this.apiUrl}/me`, {
          headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
        }).pipe(
          map(() => true),
          catchError(() => {
            this.clearSession();
            return of(false);
          })
        );
      }
    }
    return of(false);
  }

  private initInactivityListener(): void {
    this.ngZone.runOutsideAngular(() => {
      const activityEvents = [
        fromEvent(window, 'mousemove'),
        fromEvent(window, 'keydown'),
        fromEvent(window, 'click'),
        fromEvent(window, 'scroll'),
        fromEvent(window, 'touchstart')
      ];

      merge(...activityEvents).subscribe(() => {
        this.resetInactivityTimer();
      });
    });
  }

  private resetInactivityTimer(): void {
    if (!this.isLoggedIn()) return;

    if (this.inactivityTimeoutId) {
      clearTimeout(this.inactivityTimeoutId);
    }

    this.inactivityTimeoutId = setTimeout(() => {
      console.warn('Tidak ada aktivitas. Melakukan logout otomatis.');
      this.logout();
    }, this.inactivityTime);
  }
}

