import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../services/user/user.service';
import { RoleService } from '../../../services/role/role.service';
import Swal from 'sweetalert2';

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
  canDeleteUser: boolean = false;
  canCreateUser: boolean = false;
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
  user: any;

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

    this.user = JSON.parse(localStorage.getItem('user') || '{}');

    this.canCreateUser = this.hasPermission('create.user');
    this.canDeleteUser = this.hasPermission('delete.user');
  }

  hasPermission(permissionName: string): boolean {
    return this.user?.role?.permissions?.some((permission: { name: string }) => permission.name === permissionName);
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

  canEdit(user: any): boolean {
    const currentUser = this.user;
    const currentRoleId = currentUser?.role_id;
    const currentUserId = currentUser?.id;
  
    // Cek apakah dia punya permission "edit.user"
    if (!this.hasPermission('edit.user')) return false;
  
    // Admin Super bisa edit siapa saja
    if (currentRoleId === 3) return true;
  
    // Admin bisa edit siapa saja
    if (currentRoleId === 1) return true;
  
    // User bisa edit dirinya sendiri
    if (user.id === currentUserId) return true;
  
    return false;
  }

  canEditRole(): boolean {
    // Mengambil role dari user yang sedang login
    const currentUser = this.user;
    const currentRoleId = currentUser?.role_id;
  
    // Admin Super (role_id === 3) dan Admin (role_id === 1) bisa mengedit role
    if (currentRoleId === 1 || currentRoleId === 3) {
      return true; // Jika Admin atau Admin Super, role bisa diedit
    }
  
    return false; // Jika bukan Admin atau Admin Super, role tidak bisa diedit
  }
  
  
  

  // Function to save or update a user
  simpanUser() {
    if (this.selectedUser) {
      // Edit user
      this.userService.updateUser(this.selectedUser.id, this.newUser).subscribe((response) => {
        const index = this.dataSource.findIndex(user => user.id === this.selectedUser.id);
        if (index > -1) {
          this.dataSource[index] = response;
        }
  
        this.closeModal();
        this.loadUser();
  
        // SweetAlert sukses edit
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'Data user berhasil diperbarui.',
          confirmButtonColor: '#3085d6'
        });
      });
    } else {
      // Tambah user baru
      this.userService.createUser(this.newUser).subscribe((response) => {
        this.dataSource.push(response);
        this.loadUser();
        this.closeModal();
  
        // SweetAlert sukses tambah
        Swal.fire({
          icon: 'success',
          title: 'Berhasil',
          text: 'User baru berhasil ditambahkan.',
          confirmButtonColor: '#3085d6'
        });
      });
    }
  }
  
  

  // Fungsi untuk memperbarui hanya role_id
//  updateRole() {
//    this.userService.updateRole(this.selectedUser.id, { role_id: this.newUser.role_id }).subscribe((response) => {
 //     const index = this.dataSource.findIndex(user => user.id === this.selectedUser.id);
//      if (index > -1) {
//        this.dataSource[index].role_id = response.role_id;  // Update role_id di dataSource
 //     }

      // Refresh DataTable
 //     this.loadUser();

      // Close modal and reset form
//      this.closeModal();
//    });
//  }

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
      password: '',
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
