import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PrayersComponent } from './components/prayers/prayers.component';
import { RegisterComponent } from './components/register/register.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { authGuard } from './auth/guards/auth.guard';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

export const routes: Routes = [
  { path: '', component: WelcomeComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'prayers',
    component: PrayersComponent,
    canActivate: [authGuard],
  },
  { path: 'reset-password', component: ResetPasswordComponent },

  { path: '**', redirectTo: '' },
];
