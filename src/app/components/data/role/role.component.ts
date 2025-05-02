import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../../services/role/role.service';
import { PermissionService } from '../../../services/permission/permission.service';  // Tambahkan service permission
import { filter } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
declare var $: any;

@Component({
  standalone: true,
  selector: 'app-role',
  templateUrl: './role.component.html',
  host: { ngSkipHydration: 'true' },
  imports: [CommonModule, FormsModule],
})
export class RoleComponent implements OnInit {
  isBrowser: boolean = false;
  canEditRole: boolean = false;
  canDeleteRole: boolean = false;
  canCreateRole: boolean = false;
  roleToDelete: any = null;
  dataSource: any[] = [];

  // Form input
  newRole = {
    name: '',
    permissions: [] as number[], // Tambahkan field untuk permission IDs
  };

  selectedRole: any = null;
  allPermissions: any[] = []; // List permission dari database
  user: any;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private roleService: RoleService,
    private router: Router,
    private permissionService: PermissionService // Inject PermissionService
  ) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      // setiap selesai navigasi, init ulang Select2
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe(() => this.initSelect2());
    }

    this.loadPermissions();
    this.LoadUser();

    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    this.canCreateRole = this.hasPermission('create.role');
    this.canEditRole = this.hasPermission('edit.role');
    this.canDeleteRole = this.hasPermission('delete.role');

  }

  ngAfterViewInit(): void {
    // pada pertama kali mount juga
    if (this.isBrowser) {
      this.initSelect2();
    }
  }

  hasPermission(permissionName: string): boolean {
    return this.user?.role?.permissions?.some((permission: { name: string }) => permission.name === permissionName);
  }

  private initSelect2(): void {
    setTimeout(() => {
      // inisialisasi dropdown permission
      $('#permission')
        .off('change')
        .select2({ width: '100%', placeholder: 'Pilih Permissions' })
        .on('change', (e: any) => {
          const vals = $(e.target).val() as string[];
          this.newRole.permissions = vals.map(v => +v);
        });

      // jika sedang edit, isi nilai awal
      if (this.selectedRole) {
        $('#permission').val(this.newRole.permissions).trigger('change');
      }
    }, 0);
  }

  LoadUser() {
    const table = $('roleTable').DataTable();
    if (table) {
      table.destroy();
    }
    
    this.roleService.getRoles().subscribe((data) => {
      this.dataSource = data;
      setTimeout(() => $('#roleTable').DataTable(), 0);
    });
  }

  loadPermissions() {
    this.permissionService.getPermissions().subscribe((data) => {
      this.allPermissions = data;
      
      this.initSelect2();
    });
  }

  simpanRole() {
    const request$ = this.selectedRole
      ? this.roleService.updateRole(this.selectedRole.id, this.newRole)
      : this.roleService.createRole(this.newRole);
  
    request$.subscribe({
      next: () => {
        this.LoadUser(); // Reload data biar tampilan table langsung update
        this.closeModal();
      },
      error: (err) => {
        console.error('Gagal menyimpan role', err);
        // Optional: kasih notif error pakai toastr atau alert
      }
    });
  }
  

  editRole(role: any) {
    this.selectedRole = role;
    this.newRole = {
      name: role?.name,
      permissions: role?.permissions?.map((p: any) => p.id) || [], // Isi list permission
    };
    $('#modalTambahRole').modal('show');

    this.initSelect2();
  }


  deleteRole(role: any) {
    this.roleToDelete = role;
    $('#confirmDeleteModal').modal('show');
  }

  closeConfirmDelete() {
    this.roleToDelete = null;
    $('#confirmDeleteModal').modal('hide');
  }

  confirmDelete() {
    if (!this.roleToDelete) return;
  
    this.roleService.deleteRole(this.roleToDelete.id).subscribe(() => {
      const index = this.dataSource.indexOf(this.roleToDelete);
      if (index > -1) {
        this.dataSource.splice(index, 1);
      }
      this.refreshTable();
      this.closeConfirmDelete();
    });
  }
  

  refreshTable() {
    const table = $('#roleTable').DataTable();
    table.destroy();
    setTimeout(() => $('#roleTable').DataTable(), 0);
  }

  openModal(): void {
    this.selectedRole = null;
    this.newRole = { name: '', permissions: [] };
  
    // Hapus semua pilihan di Select2
    $('#permission').val([]).trigger('change');
  
    $('#modalTambahRole').modal('show');
    this.initSelect2();
  }

  closeModal() {
    this.newRole = { name: '', permissions: [] };
    this.selectedRole = null;
    $('#modalTambahRole').modal('hide');
  }
}
