import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api'; // Laravel API
  private loggedInSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.isLoggedIn());
  loggedIn$ = this.loggedInSubject.asObservable();

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        console.log('Login Response:', response);
        if (response.status === 'success') {
          if (isPlatformBrowser(this.platformId)) {
            // Hanya set localStorage jika berada di browser
            localStorage.setItem('user', JSON.stringify(response.admin));
          }
          this.loggedInSubject.next(true);  // Memperbarui status login
          console.log('User logged in:', response.admin);
        }
      })
    );
  }
  
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      // Hanya akses localStorage jika berada di browser
      localStorage.removeItem('user');
    }
    this.loggedInSubject.next(false); // Memperbarui status login
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      // Periksa apakah ada data user di localStorage setelah refresh, hanya di browser
      const user = localStorage.getItem('user');
      return user !== null;
    }
    return false; // Default fallback untuk server-side
  }

  getUser() {
    if (isPlatformBrowser(this.platformId)) {
      // Pastikan akses localStorage hanya di browser
      return JSON.parse(localStorage.getItem('user')!);
    }
    return null;
  }
}
