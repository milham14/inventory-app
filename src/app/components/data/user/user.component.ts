import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { RoleService } from '../../../services/role/role.service';

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
  userToDelete: any = null;
  dataSource: any[] = [];
  roleData: any[] = []; // Data untuk role
  
  // New user data for form
  newUser = {
    name: '',
    username: '',
    email: '',
    password: '',
    role_id: null // Menambahkan role_id
  };

  // Selected user for editing
  selectedUser: any = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UserService,
    private roleService: RoleService // Menambahkan RoleService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isBrowser = true;
    }

    this.loadUser();
    this.loadRoles(); // Memuat data role
  }

  loadUser() {
    this.userService.getUsers().subscribe((data) => {
      this.dataSource = data;
      setTimeout(() => $('#userTable').DataTable(), 0); // Inisialisasi DataTable
    });
  }

  // Fungsi untuk memuat role
  loadRoles() {
    this.roleService.getRoles().subscribe((data) => {
      this.roleData = data; // Menyimpan role dalam roleData
    });
  }

  // Function to save or update a user
  simpanUser() {
    if (this.selectedUser) {
      // Jika hanya role_id yang berubah
      if (this.selectedUser.role_id !== this.newUser.role_id) {
        // Update role_id saja
        this.updateRole();
      } else {
        // Update user secara keseluruhan
        this.updateUser();
      }
    } else {
      // Create new user
      this.userService.createUser(this.newUser).subscribe((response) => {
        this.dataSource.push(response);  // Add new user to dataSource

        // Refresh DataTable
        this.loadUser();

        // Close modal and reset form
        this.closeModal();
      });
    }
  }

  // Fungsi untuk memperbarui hanya role_id
  updateRole() {
    this.userService.updateRole(this.selectedUser.id, { role_id: this.newUser.role_id }).subscribe((response) => {
      const index = this.dataSource.findIndex(user => user.id === this.selectedUser.id);
      if (index > -1) {
        this.dataSource[index].role_id = response.role_id;  // Update role_id di dataSource
      }

      // Refresh DataTable
      this.loadUser();

      // Close modal and reset form
      this.closeModal();
    });
  }

  // Fungsi untuk memperbarui user secara keseluruhan
  updateUser() {
    this.userService.updateUser(this.selectedUser.id, this.newUser).subscribe((response) => {
      const index = this.dataSource.findIndex(user => user.id === this.selectedUser.id);
      if (index > -1) {
        this.dataSource[index] = response;  // Update data user di dataSource
      }

      // Refresh DataTable
      this.loadUser();

      // Close modal and reset form
      this.closeModal();
    });
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
      password: '',  // Password won't be pre-filled for security reasons
      role_id: user.role_id  // Menambahkan role_id untuk editing
    };

    // Open modal for editing
    $('#modalTambahUser').modal('show');
  }

  // Function to delete a user
  deleteUser(permission: any) {
    this.userToDelete = permission;
    $('#confirmDeleteModal').modal('show');
  }

  closeConfirmDelete(){
    this.userToDelete = null;
    $('#confirmDeleteModal').modal('hide');
  }

  confirmDelete() {
    if (!this.userToDelete) return;

    this.userService.deleteUser(this.userToDelete.id).subscribe(() => {
      const index = this.dataSource.indexOf(this.userToDelete);
      if (index > -1 ) {
        this.dataSource.splice(index, 1);
      }
      this.refreshDataTable();
      this.closeConfirmDelete();
    })
  }

  openModal() {
    // Reset form state
    this.newUser = {
      name: '',
      username: '',
      email: '',
      password: '',
      role_id: null // Reset role_id
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
      password: '',
      role_id: null // Reset role_id
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
