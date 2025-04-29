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
  canViewDataMaster: boolean = false;
  canViewDataMaterial: boolean = false;
  user: any;
  roleId: number = 0;
  loading = true;
  canViewUser: boolean = false;
  canViewRole: boolean = false;
  canViewPermission: boolean = false;
  canViewMaterial: boolean = false;
  canViewPart: boolean = false;
  canViewSupplier: boolean = false;
  canViewCustomer: boolean = false;

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
          // Mengambil data pengguna dari localStorage
   // this.user = JSON.parse(localStorage.getItem('user') || '{}');

    // Mengecek apakah pengguna memiliki izin untuk melihat Data Master
   // this.canViewDataMaster = this.user.role?.permissions.some((permission: { name: string; }) => permission.name === 'view.datamaster');

    // Mengecek apakah pengguna memiliki izin untuk melihat Material
   // this.canViewMaterial = this.user.role?.permissions.some((permission: { name: string; }) => permission.name === 'view.datamaterial');
    }
    
    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    this.canViewDataMaster = this.hasPermission('view.datamaster');
    this.canViewDataMaterial = this.hasPermission('view.datamaterial');
    this.canViewUser = this.hasPermission('view.user');
    this.canViewRole = this.hasPermission('view.role');
    this.canViewPermission = this.hasPermission('view.permission');
    this.canViewMaterial = this.hasPermission('view.material');
    this.canViewPart = this.hasPermission('view.part');
    this.canViewSupplier = this.hasPermission('view.supplier');
    this.canViewCustomer = this.hasPermission('view.customer');

    this.roleId = this.auth.getRoleId();
    
  }

  hasPermission(permissionName: string): boolean {
    return this.user?.role?.permissions?.some((permission: { name: string }) => permission.name === permissionName);
  }  

  hasRole(roleId: number): boolean {
    return this.roleId === roleId;
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
