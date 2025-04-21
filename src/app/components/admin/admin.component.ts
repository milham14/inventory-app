import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  templateUrl: './admin.component.html',
  imports: [RouterLink, RouterOutlet, CommonModule]
})
export class AdminComponent implements OnInit {
  userMenuOpen = false;

  constructor(private router:Router) {}

  /** 
   * Toggle menu; 
   * stop event supaya HostListener gak langsung menutup lagi 
   */
  toggleUserMenu(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.userMenuOpen = !this.userMenuOpen;
  }

  /** Hanya logout waktu tombol logout diklik */
  onLogoutClick(event: MouseEvent) {
    event.stopPropagation();
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  /** Tutup menu kalau klik di luar treeview */
  @HostListener('document:click', ['$event.target'])
  onDocumentClick(target: HTMLElement) {
    if (!target.closest('.has-treeview')) {
      this.userMenuOpen = false;
    }
  }

  ngOnInit(): void {
    
  }
}
