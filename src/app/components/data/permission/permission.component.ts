import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PermissionService } from '../../../services/permission/permission.service'; 

declare var $: any;

@Component({
  standalone: true,
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  host: { ngSkipHydration: 'true' },
  imports: [CommonModule, FormsModule],
})
export class PermissionComponent implements OnInit {
  isBrowser: boolean = false;
  canEditPermission: boolean = false;
  canDeletePermission: boolean = false;
  canCreatePermission: boolean = false;
  permissionToDelete: any = null;
  dataSource: any[] = [];

  // New user data for form
  newPermission = {
    name: '',
  };

  // Selected user for editing
  selectedPermission: any = null;
  user: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private permissionService: PermissionService) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
    }

    this.loadUser();

    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    this.canCreatePermission = this.hasPermission('create.permission');
    this.canEditPermission = this.hasPermission('edit.permission');
    this.canDeletePermission = this.hasPermission('delete.permission');

  }

  hasPermission(permissionName: string): boolean {
    return this.user?.role?.permissions?.some((permission: { name: string }) => permission.name === permissionName);
  } 

  loadUser() {
    const table = $('#permissionTable').DataTable();
    if (table) {
      table.destroy(); // Hancurkan datatable dulu supaya tidak conflict
    }
  
    this.permissionService.getPermissions().subscribe((data) => {
      this.dataSource = data;
      setTimeout(() => {
        $('#permissionTable').DataTable(); // Reinitialize DataTable setelah data selesai load
      }, 0);
    });
  }
  

  // Function to save or update a user
  simpanUser() {
    const request$ = this.selectedPermission
      ? this.permissionService.updatePermission(this.selectedPermission.id, this.newPermission)
      : this.permissionService.createPermission(this.newPermission);
  
    request$.subscribe({
      next: () => {
        this.loadUser(); // Pindah di sini supaya hanya reload setelah sukses
        this.closeModal();
      },
      error: (err) => {
        console.error('Gagal menyimpan permission', err);
      }
    });
  }
  

  // Function to edit a user
  editUser(permission: any) {
    console.log('Edit user:', permission);
    this.selectedPermission = permission;  // Store selected user for editing

    // Populate the form with the selected user's data
    this.newPermission = { 
      name: permission?.name
    };

    // Open modal for editing
    $('#modalTambahPermission').modal('show');
  }

  // Function to delete a user
  deleteUser(permission: any) {
    this.permissionToDelete = permission;
    $('#confirmDeleteModal').modal('show');
  }

  closeConfirmDelete(){
    this.permissionToDelete = null;
    $('#confirmDeleteModal').modal('hide');
  }

  confirmDelete() {
    if (!this.permissionToDelete) return;

    this.permissionService.deletePermission(this.permissionToDelete.id).subscribe(() => {
      const index = this.dataSource.indexOf(this.permissionToDelete);
      if (index > -1 ) {
        this.dataSource.splice(index, 1);
      }
      this.refreshDataTable();
      this.closeConfirmDelete();
    })
  }

  openModal() {
    // Reset form state
    this.newPermission = {
      name: ''
    };
    this.selectedPermission = null;

    // Buka modal
    $('#modalTambahPermission').modal('show');
  }

  closeModal() {
    this.newPermission = {
      name: ''
    };
    this.selectedPermission = null;

    $('#modalTambahPermission').modal('hide');
  }

  // Function to refresh DataTable
  refreshDataTable() {
    const table = $('#permissionTable').DataTable();
    table.destroy();
    setTimeout(() => {
      $('#permissionTable').DataTable();  // Reinitialize DataTable
    }, 0);
  }
}
