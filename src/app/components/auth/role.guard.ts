import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Ambil user dari localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    // Ambil daftar permission yang dibutuhkan dari route data
    const required: string[] = next.data['permissions'] || [];

    // Jika tidak ada requirement khusus, izinkan
    if (required.length === 0) return true;

    // Cek apakah user punya minimal satu permission
    const hasOne = user.role?.permissions?.some((p: any) =>
      required.includes(p.name)
    );

    if (hasOne) return true;

    // Kalau gak, redirect ke forbidden
    this.router.navigate(['/forbidden']);
    return false;
  }
}
