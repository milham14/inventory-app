import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';

declare var $: any;

@Component({
  standalone: true,
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  host: { ngSkipHydration: 'true' },
  imports: [CommonModule, FormsModule],
})
export class SupplierComponent implements OnInit, AfterViewInit {
  isBrowser: boolean = false;
  dataSource: any[] = [];

  // New user data for form
  newUser = {
    nama_supplier: '',
    alamat_supplier: '',
  };

  // Selected user for editing
  selectedUser: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
    }

    // Initial data
    this.dataSource = [];
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => {
        $('#userTable').DataTable();  // Initialize DataTable
      }, 0);
    }
  }

  // Function to save a new user
  simpanUser() {
    if (this.selectedUser) {
      // Edit existing user
      this.selectedUser.nama_supplier = this.newUser.nama_supplier;
      this.selectedUser.alamat_supplier = this.newUser.alamat_supplier;
    } else {
      // Add new user
      this.dataSource.push({
        nama_supplier: this.newUser.nama_supplier,
        alamat_supplier: this.newUser.alamat_supplier,
      });
    }

    // Refresh DataTable after adding or editing user
    const table = $('#userTable').DataTable();
    table.destroy();

    setTimeout(() => {
      $('#userTable').DataTable();  // Reinitialize DataTable
    }, 0);

    // Close modal
    $('#modalTambahUser').modal('hide');

    // Reset form
    this.newUser = {
      nama_supplier: '',
      alamat_supplier: '',
    };
    this.selectedUser = null;  // Clear selected user after saving
  }

  // Function to edit a user
  editUser(user: any) {
    console.log('Edit user:', user);
    this.selectedUser = user;  // Store selected user for editing

    // Populate the form with the selected user's data
    this.newUser = { 
      nama_supplier: user.nama_supplier,
      alamat_supplier: user.alamat_supplier,
    };

    // Open modal for editing
    $('#modalTambahUser').modal('show');
  }

  // Function to delete a user
  deleteUser(user: any) {
    console.log('Delete user:', user);
    
    // Remove user from dataSource
    const index = this.dataSource.indexOf(user);
    if (index > -1) {
      this.dataSource.splice(index, 1);
    }

    // Refresh DataTable after deletion
    const table = $('#userTable').DataTable();
    table.destroy();

    setTimeout(() => {
      $('#userTable').DataTable();  // Reinitialize DataTable
    }, 0);
  }

  openModal() {
    // Reset form state
    this.newUser = {
      nama_supplier: '',
      alamat_supplier: '',
    };
    this.selectedUser = null;
  
    // Buka modal
    $('#modalTambahUser').modal('show');
  }
  closeModal() {
    this.newUser = {
      nama_supplier: '',
      alamat_supplier: '',
    };
    this.selectedUser = null;
  
    $('#modalTambahUser').modal('hide');
  }
}
