import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [RouterLink]
})
export class DashboardComponent implements OnInit {
  ngOnInit(): void {
    
  }
}
