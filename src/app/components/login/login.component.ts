import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule]
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  errorMessage = '';

  constructor( private auth: AuthService, private router: Router ) {}

  onSubmit() {
    this.auth.login(this.username, this.password).subscribe({
      next: (response) => {
        // Kirim user lewat navigation state
        this.router.navigate(['/admin/dashboard'], {
          state: { user: response.admin }
        });
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Login gagal!';
      }
    });
  }
  

  ngOnInit(): void {
    
  }
}
