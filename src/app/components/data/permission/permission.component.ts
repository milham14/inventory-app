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
  dataSource: any[] = [];

  // New user data for form
  newPermission = {
    name: '',
  };

  // Selected user for editing
  selectedPermission: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private permissionService: PermissionService) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
    }

    this.loadUser();
  }

  loadUser() {
    this.permissionService.getPermissions().subscribe((data) => {
      this.dataSource = data;
      setTimeout(() => $('#permissionTable').DataTable(), 0); // Inisialisasi DataTable
    });
  }

  // Function to save or update a user
  simpanUser() {
    if (this.selectedPermission) {
      // Update existing user
      this.permissionService.updatePermission(this.selectedPermission.id, this.newPermission).subscribe((response) => {
        const index = this.dataSource.findIndex(permission => permission.id === this.selectedPermission.id);
        if (index > -1) {
          this.dataSource[index] = response;  // Update data in dataSource
        }

        // Refresh DataTable
        this.refreshDataTable();

        // Close modal and reset form
        this.closeModal();
      });
    } else {
      // Create new user
      this.permissionService.createPermission(this.newPermission).subscribe((response) => {
        this.dataSource.push(response);  // Add new user to dataSource

        // Refresh DataTable
        this.refreshDataTable();

        // Close modal and reset form
        this.closeModal();
      });
    }
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
    console.log('Delete user:', permission);

    this.permissionService.deletePermission(permission.id).subscribe(() => {
      // Remove user from dataSource
      const index = this.dataSource.indexOf(permission);
      if (index > -1) {
        this.dataSource.splice(index, 1);
      }

      // Refresh DataTable
      this.refreshDataTable();
    });
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
