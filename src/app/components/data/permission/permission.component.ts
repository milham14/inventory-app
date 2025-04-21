import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { isPlatformBrowser } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator'; // BUKAN MatPaginatorModule
import { MatPaginatorModule } from '@angular/material/paginator'; // ✅ ini tetap dipakai
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

declare var $: any;

@Component({
  standalone: true,
  selector: 'app-user',
  imports: [CommonModule, MatPaginatorModule, MatTableModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './permission.component.html',
  host: {ngSkipHydration: 'true'},
})
export class PermissionComponent implements OnInit, AfterViewInit  {
  isBrowser: boolean = false;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  displayedColumns: string[] = ['no', 'nama', 'username', 'role', 'action'];
  rows: any[] = [];

  dataSource = new MatTableDataSource<any>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

 ngOnInit(): void {
  const singleRow = { 
    nama: 'John Doe', 
    username: 'john@example.com', 
    role: 'Admin' 
  };
  // Gandakan data menjadi 5 baris dengan menambahkan nomor urut
  this.rows = Array(1).fill(null).map((_, index) => ({
    no: index + 1,  // Menambahkan nomor urut
    nama: singleRow.nama,
    username: singleRow.username,
    role: singleRow.role
  }));
  this.dataSource.data = this.rows;

  if (isPlatformBrowser(this.platformId)) {
    this.isBrowser = true;
  }
 }

 ngAfterViewInit() {
  setTimeout(() => {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  });
}


editUser(row: any) {
  // Handle Edit button click
  console.log('Edit user:', row);
}

deleteUser(row: any) {
  // Handle Hapus button click
  console.log('Delete user:', row);
}

  
}
