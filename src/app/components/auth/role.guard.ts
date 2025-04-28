import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'; 

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRole = route.data['role']; // Role yang dibutuhkan
    const userRole = this.authService.getRoleId(); // Role pengguna

    if (userRole === requiredRole) {
      return true; // Jika role cocok, akses diperbolehkan
    } else {
      this.router.navigate(['/forbidden']); // Jika role tidak cocok, arahkan ke halaman forbidden
      return false; // Akses diblokir
    }
  }
}
