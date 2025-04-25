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
    if (this.selectedRole) {
      // Update
      this.roleService.updateRole(this.selectedRole.id, this.newRole).subscribe((response) => {
        const index = this.dataSource.findIndex((role) => role.id === this.selectedRole.id);
        if (index > -1) {
          this.dataSource[index] = response;
        }
        this.refreshTable();
        this.closeModal();
      });
    } else {
      // Create
      this.roleService.createRole(this.newRole).subscribe((response) => {
        this.dataSource.push(response);
        this.refreshTable();
        this.closeModal();
      });
    }
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
    this.roleService.deleteRole(role.id).subscribe(() => {
      const index = this.dataSource.indexOf(role);
      if (index > -1) {
        this.dataSource.splice(index, 1);
      }
      this.refreshTable();
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
