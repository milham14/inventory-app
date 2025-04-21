import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  standalone: true,
  templateUrl: './admin.component.html',
  imports: [RouterLink, RouterOutlet, CommonModule]
})
export class AdminComponent implements OnInit {
  userMenuOpen = false;
  masterDataOpen = false;
  acceptMaterialOpen = false;
  authService: any;

  constructor(private router:Router, private auth: AuthService) {}

  ngOnInit(): void {
        // Cek apakah user sudah login, jika belum, arahkan ke halaman login
    if (!this.auth.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  /** 
   * Toggle menu; 
   * stop event supaya HostListener gak langsung menutup lagi 
   */
  toggleUserMenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
  }

  toggleDataMaster(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.masterDataOpen = !this.masterDataOpen;
  }

  toggleAcceptMaterial(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.acceptMaterialOpen = !this.acceptMaterialOpen;
  }

  /** Hanya logout waktu tombol logout diklik */
  onLogoutClick(event: MouseEvent) {
    event.stopPropagation();
    /**localStorage.removeItem('token'); */
    this.router.navigate(['/login']);
  }

  /** Tutup menu kalau klik di luar treeview */
  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: HTMLElement) {
    if (!target.closest('.has-treeview')) {
      this.userMenuOpen = false;
    }
    if (!target.closest('.has-treeview')) {
      this.masterDataOpen = false;
    }
    if (!target.closest('.has-treeview')) {
      this.acceptMaterialOpen = false;
    }
  }
}
