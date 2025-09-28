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

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  availableCities: string[] = [];
  errorMessage: string = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private locationService: LocationService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern('^[A-Za-z\u0590-\u05FF][A-Za-z\u0590-\u05FF\\s]*'),
        ],
      ],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern('^(0[23489]\\d{7}|05\\d{8})')],
      ],
      city: ['', Validators.required],
      synagogue: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadCities();
  }

  private loadCities(): void {
    this.locationService.getAvailableCities().subscribe({
      next: (cities) => (this.availableCities = cities),
      error: (error) => console.error('Error loading cities:', error),
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isSubmitting = true;
      this.authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['/prayers']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Registration failed';
          this.isSubmitting = false;
        },
      });
    }
  }
}
