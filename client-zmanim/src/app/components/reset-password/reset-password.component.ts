import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/services/auth.service';
import { LocationService } from '../../services/location.service';
import { RouterModule } from '@angular/router';

interface ValidateDetailsUser {
  email: string;
  phoneNumber: string;
  city: string;
  synagogue: string;
}
interface NewPasswordData {
  userId: string;
  password: string;
}
@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent implements OnInit {
  ForgotPasswordForm: FormGroup;
  NewPasswordForm: FormGroup;
  availableCities: string[] = [];
  errorMessage: string = '';
  isSubmitting = false;
  isSubmittingNewPassword = false;
  isVerified = false;
  userId: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private locationService: LocationService,
    private router: Router
  ) {
    this.ForgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^(0[23489]\\d{7}|05\\d{8})')],
      ],
      city: ['', Validators.required],
      synagogue: ['', [Validators.required]],
    });

    this.NewPasswordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }
  ngOnInit(): void {
    this.loadCities();
  }
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }
  private loadCities(): void {
    this.locationService.getAvailableCities().subscribe({
      next: (cities) => (this.availableCities = cities),
      error: (error) => console.error('Error loading cities:', error),
    });
  }

  onSubmit(): void {
    if (this.ForgotPasswordForm.valid) {
      this.isSubmitting = true;
      this.authService.resetdetails(this.ForgotPasswordForm.value).subscribe({
        next: (response) => {
          this.userId = String(response.userId);

          this.isVerified = true;
        },
        error: (error) => {
          if (error.status === 404) {
            this.errorMessage = 'User not found';
          } else if (error.status === 400) {
            this.errorMessage = 'Invalid details provided';
          } else {
            this.errorMessage = 'פרטים לא נכונים או משתמש אינו קיים';
          }
          this.isSubmitting = false;
        },
      });
    }
  }

  onSubmitNewPassword(): void {
    if (this.NewPasswordForm.valid) {
      this.isSubmittingNewPassword = true;
      this.errorMessage = '';

      const newPasswordData: NewPasswordData = {
        userId: this.userId,
        password: this.NewPasswordForm.get('password')?.value,
      };

      this.authService.updatePassword(newPasswordData).subscribe({
        next: (response) => {
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'עדכון סיסמה נכשל';
          this.isSubmittingNewPassword = false;
        },
      });
    }
  }
}
