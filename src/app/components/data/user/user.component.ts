import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';

declare var $: any;

@Component({
  standalone: true,
  selector: 'app-user',
  templateUrl: './user.component.html',
  host: { ngSkipHydration: 'true' },
  imports: [CommonModule, FormsModule],
})
export class UserComponent implements OnInit {
  isBrowser: boolean = false;
  dataSource: any[] = [];

  // New user data for form
  newUser = {
    name: '',
    username: '',
    email: '',
    password: ''
  };

  // Selected user for editing
  selectedUser: any = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private userService: UserService) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
    }

    this.loadUser();
  }

  loadUser() {
    this.userService.getUsers().subscribe((data) => {
      this.dataSource = data;
      setTimeout(() => $('#userTable').DataTable(), 0); // Inisialisasi DataTable
    });
  }

  // Function to save or update a user
  simpanUser() {
    if (this.selectedUser) {
      // Update existing user
      this.userService.updateUser(this.selectedUser.id, this.newUser).subscribe((response) => {
        const index = this.dataSource.findIndex(user => user.id === this.selectedUser.id);
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
      this.userService.createUser(this.newUser).subscribe((response) => {
        this.dataSource.push(response);  // Add new user to dataSource

        // Refresh DataTable
        this.refreshDataTable();

        // Close modal and reset form
        this.closeModal();
      });
    }
  }

  // Function to edit a user
  editUser(user: any) {
    console.log('Edit user:', user);
    this.selectedUser = user;  // Store selected user for editing

    // Populate the form with the selected user's data
    this.newUser = { 
      name: user?.name, 
      username: user.username, 
      email: user.email, 
      password: ''  // Password won't be pre-filled for security reasons
    };

    // Open modal for editing
    $('#modalTambahUser').modal('show');
  }

  // Function to delete a user
  deleteUser(user: any) {
    console.log('Delete user:', user);

    this.userService.deleteUser(user.id).subscribe(() => {
      // Remove user from dataSource
      const index = this.dataSource.indexOf(user);
      if (index > -1) {
        this.dataSource.splice(index, 1);
      }

      // Refresh DataTable
      this.refreshDataTable();
    });
  }

  openModal() {
    // Reset form state
    this.newUser = {
      name: '',
      username: '',
      email: '',
      password: ''
    };
    this.selectedUser = null;

    // Buka modal
    $('#modalTambahUser').modal('show');
  }

  closeModal() {
    this.newUser = {
      name: '',
      username: '',
      email: '',
      password: ''
    };
    this.selectedUser = null;

    $('#modalTambahUser').modal('hide');
  }

  // Function to refresh DataTable
  refreshDataTable() {
    const table = $('#userTable').DataTable();
    table.destroy();
    setTimeout(() => {
      $('#userTable').DataTable();  // Reinitialize DataTable
    }, 0);
  }
}
