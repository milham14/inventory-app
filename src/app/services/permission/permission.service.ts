import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private apiUrl = 'http://127.0.0.1:8000/api/permissions';

  constructor(private http: HttpClient) {}

  // Get all permissions
  getPermissions(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Create new permission
  createPermission(permission: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, permission);
  }

  // Update permission
  updatePermission(id: number, permission: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, permission);
  }

  // Delete permission
  deletePermission(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
