import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    console.log('Current user:', user);
    console.log('Trying to access route:', next.routeConfig?.path);

    // List of permissions to check for various routes
    const permissions = {
      'user': 'view.user',
      'role': 'view.role',
      'permission': 'view.permission',
      'customer': 'view.customer',
      'supplier': 'view.supplier',
      'part': 'view.part',
      'material': 'view.material',
    };

    // Check if the current route matches one of the routes that require permissions
    const requiredPermission = permissions[next.routeConfig?.path as keyof typeof permissions];

    if (requiredPermission) {
      const hasPermission = user?.role?.permissions.some(
        (permission: { name: string }) => permission.name === requiredPermission
      );

      console.log(`Has permission for ${next.routeConfig?.path}:`, hasPermission);
      if (!hasPermission) {
        this.router.navigate(['/forbidden']);
        return false;
      }
    }

    return true; // Allow access if permission check passes
  }
}
