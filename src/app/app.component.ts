import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api/api.service';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  template: `<h1>Angular + Laravel</h1>
  <p *ngIf="message">Pesan dari Laravel: {{ message }}</p>`,
})
export class AppComponent {
  title = 'inventory-management';

  private api = inject(ApiService);
  private authService = inject(AuthService);
  message = '';

  constructor() {
    this.api.ping().subscribe({
      next: (res) => {
        this.message = res.message;
        console.log('Berhasil Tersambung Ke API:', res);
      },
      error: (err) => {
        console.error('Gagal Tersambung Ke API:', err);
      },
    });

    this.authService.checkTokenValidity().subscribe();
  }
}
