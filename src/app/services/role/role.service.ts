import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl = 'http://127.0.0.1:8000/api/roles';

  constructor(private http: HttpClient) {}

  // Get all roles
  getRoles(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  // Create new role
  createRole(role: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, role);
  }

  // Update role
  updateRole(id: number, role: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, role);
  }

  // Delete role
  deleteRole(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
