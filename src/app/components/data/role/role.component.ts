import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RoleService } from '../../../services/role/role.service';
import { PermissionService } from '../../../services/permission/permission.service';  // Tambahkan service permission
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
  roleToDelete: any = null;
  dataSource: any[] = [];

  // Form input
  newRole = {
    name: '',
    permissions: [] as number[], // Tambahkan field untuk permission IDs
  };

  selectedRole: any = null;
  allPermissions: any[] = []; // List permission dari database

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private roleService: RoleService,
    private permissionService: PermissionService // Inject PermissionService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
    }

    this.loadPermissions();
    this.LoadUser();
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

  openModal() {
    this.newRole = { name: '', permissions: [] };
    this.selectedRole = null;
    $('#modalTambahRole').modal('show');
  }

  closeModal() {
    this.newRole = { name: '', permissions: [] };
    this.selectedRole = null;
    $('#modalTambahRole').modal('hide');
  }
}
