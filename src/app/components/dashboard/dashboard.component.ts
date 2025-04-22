import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [RouterLink, CommonModule]
})
export class DashboardComponent implements OnInit {
  loading = true;

  ngOnInit(): void {
    // Simulasi loading (bisa diganti pas ambil data dari API nanti)
    setTimeout(() => {
      this.loading = false;
    }, 1000);
  }
}
