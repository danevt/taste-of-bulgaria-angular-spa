import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.markFormAsTouched(form);
      return;
    }

    const { username, email, password, rePassword } = form.value;

    if (password !== rePassword) {
      console.error('Passwords do not match');
      this.markFormAsTouched(form);
      return;
    }

    this.authService.register(email, username, password).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        console.error('Registration failed', err);
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
