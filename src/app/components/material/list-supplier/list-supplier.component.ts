import { Component, AfterViewInit,OnInit,PLATFORM_ID, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { PermissionService } from '../../../services/permission/permission.service';

declare var $: any; // Mengakses jQuery yang sudah ada di global scope

@Component({
  standalone: true,
  selector: 'app-list-supplier',
  templateUrl: './list-supplier.component.html',
  host: { ngSkipHydration: 'true' },
  imports: [CommonModule, FormsModule]
})
export class ListSupplierComponent implements AfterViewInit, OnInit {
  isBrowser: boolean = false;
  allPermissions: any[] = [];
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private permissionService: PermissionService
  ) { }

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      // setiap selesai navigasi, init ulang Select2
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd))
        .subscribe(() => this.initSelect2());
    }

    this.LoadPermissions();
  }

  ngAfterViewInit(): void {
    // pada pertama kali mount juga
    if (this.isBrowser) {
      this.initSelect2();
    }
  }

  private initSelect2() {
    // delay kecil supaya elemen sudah ada
    setTimeout(() => {
      $('.select2').select2();
      $('.select2bs4').select2({ theme: 'bootstrap4' });
    }, 0);
  }

  LoadPermissions() {
    this.permissionService.getPermissions().subscribe((data) => {
      this.allPermissions = data;
      
      this.initSelect2();
    })
  }

}
