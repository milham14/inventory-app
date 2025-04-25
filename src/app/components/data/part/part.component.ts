import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';

declare var $: any;

@Component({
  standalone: true,
  selector: 'app-part',
  templateUrl: './part.component.html',
  host: { ngSkipHydration: 'true' },
  imports: [CommonModule, FormsModule],
})
export class PartComponent implements OnInit, AfterViewInit {
  isBrowser: boolean = false;
  dataSource: any[] = [];

  // New user data for form
  newUser = {
    nomor_part: '',
    nama_part: '',
    qty: '',
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
      this.selectedUser.nomor_part = this.newUser.nomor_part;
      this.selectedUser.nama_part = this.newUser.nama_part;
      this.selectedUser.qty = this.newUser.qty;
    } else {
      // Add new user
      this.dataSource.push({
        nomor_part: this.newUser.nomor_part,
        nama_part: this.newUser.nama_part,
        qty: this.newUser.qty,
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
      nomor_part: '',
      nama_part: '',
      qty: '',
    };
    this.selectedUser = null;  // Clear selected user after saving
  }

  // Function to edit a user
  editUser(user: any) {
    console.log('Edit user:', user);
    this.selectedUser = user;  // Store selected user for editing

    // Populate the form with the selected user's data
    this.newUser = { 
      nomor_part: user.nomor_part, 
      nama_part: user.nama_part, 
      qty: user.qty,
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
      nomor_part: '',
      nama_part: '',
      qty: '',
    };
    this.selectedUser = null;
  
    // Buka modal
    $('#modalTambahUser').modal('show');
  }
  closeModal() {
    this.newUser = {
      nomor_part: '',
      nama_part: '',
      qty: '',
    };
    this.selectedUser = null;
  
    $('#modalTambahUser').modal('hide');
  }
}
