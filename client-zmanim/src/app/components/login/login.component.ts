import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../auth/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email, password).subscribe({
        next: (response) => {
          this.router.navigate(['/prayers']);
        },
        error: (error) => {
          if (error.status === 500) {
            this.errorMessage = error.error.message || 'שגיאת שרת';
          } else if (error.status === 401) {
            this.errorMessage =
              error.error.message || 'משתמש לא קיים במערכת או שהפרטים שגויים';
          } else {
            this.errorMessage = 'משתמש לא קיים במערכת או שהפרטים שגויים';
          }
        },
      });
    }
  }
}
