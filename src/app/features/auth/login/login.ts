import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.markFormAsTouched(form);
      return;
    }

    const { email, password } = form.value;

    this.authService.login(email, password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        console.error('Login failed', err);
        this.markFormAsTouched(form);
      },
    });
  }

  private markFormAsTouched(form: NgForm): void {
    Object.keys(form.controls).forEach((key) => {
      form.controls[key].markAsTouched();
    });
  }
}
