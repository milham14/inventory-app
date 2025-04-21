import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api/api.service';

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
  message = '';

  constructor() {
    this.api.ping().subscribe({
      next: (res) => {
        this.message = res.message;
        console.log('Berhasil konek Laravel:', res);
      },
      error: (err) => {
        console.error('Gagal konek Laravel:', err);
      },
    });
  }
}
