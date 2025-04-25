import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  standalone: true,
  templateUrl: './admin.component.html',
  imports: [RouterLink, RouterOutlet, CommonModule]
})
export class AdminComponent implements OnInit {
  userMenuOpen = false;
  masterDataOpen = false;
  acceptMaterialOpen = false;
  user: any;
  loading = true;

  constructor(private router:Router, @Inject(PLATFORM_ID) private platformId: Object, private auth: AuthService) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { user: any };

    if (state?.user) {
      this.user = state.user;
      console.log('User dari state:', this.user);
      setTimeout(() => {
        this.loading = false;
      }, 100);
    } else if (isPlatformBrowser(this.platformId)) {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        this.user = JSON.parse(savedUser);
        console.log('User dari localStorage:', this.user);
        setTimeout(() => {
          this.loading = false;
        }, 100);
      } else {
        this.router.navigate(['/login']);
      }
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
    this.auth.logout();
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
