import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

import * as CryptoJS from 'crypto-js';

interface AuthResponse {
  token: string;
  userId: number;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private readonly ENCRYPTION_KEY = 'your-secure-key-here';
  private readonly TOKEN_KEY = 'token';
  private readonly USER_ID_KEY = 'userId';
  private readonly TIMESTAMP_KEY = 'token_timestamp';

  // New memory storage
  private _memoryToken: string | null = null;
  private memoryUserId: number | null = null;
  private memoryTimestamp: string | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  get memoryToken(): string | null {
    return this.decryptToken(this._memoryToken || '');
  }
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/Users/login`, {
        Email: email,
        Password: password,
      })
      .pipe(
        map((response: AuthResponse) => {
          this.handleAuthSuccess(response);
          return response;
        }),
        catchError((error) => {
          if (error.status === 401) {
            return throwError(() => new Error(error.error.message));
          }
          if (error.status === 400) {
            return throwError(() => new Error('Invalid email or password'));
          }
          return throwError(() => new Error('Server error occurred'));
        })
      );
  }

  register(registerData: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/Users/register`, registerData)
      .pipe(
        map((response: AuthResponse) => {
          this.handleAuthSuccess(response);
          return response;
        })
      );
  }

  private handleAuthSuccess(response: AuthResponse): void {
    const encryptedToken = this.encryptToken(response.token);
    // Store in memory only
    this._memoryToken = encryptedToken;
    this.memoryUserId = response.userId;
    this.memoryTimestamp = Date.now().toString();

    // Store non-sensitive data in localStorage
    localStorage.setItem(this.USER_ID_KEY, response.userId.toString());
    localStorage.setItem(this.TIMESTAMP_KEY, Date.now().toString());
  }
  //esty
  resetdetails(resetData: any): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/Users/resetPassword`, {
        Email: resetData.email,
        PhoneNumber: resetData.phoneNumber,
        City: resetData.city,
        Synagogue: resetData.synagogue,
      })
      .pipe(
        map((response: AuthResponse) => {
          this.handleAuthSuccess(response);
          return response;
        })
      );
  }
  updatePassword(data: { userId: string; password: string }) {
    const serverData = {
      UserId: data.userId,
      password: data.password,
    };
    return this.http.post<{ userId: number }>(
      `${this.apiUrl}/Users/UpdatePassword`,
      serverData
    );
  }

  getCurrentUserId(): number {
    return (
      this.memoryUserId || Number(localStorage.getItem(this.USER_ID_KEY)) || 0
    );
  }

  getCurrentUserDetails(): Observable<any> {
    // If we have a userId in memory, fetch the user details
    if (this.memoryUserId) {
      // Create headers with the authentication token
      const headers = new HttpHeaders({
        Authorization: `Bearer ${this.memoryToken}`,
      });

      // Include the headers in the request
      return this.http
        .get<any>(`${this.apiUrl}/Users/${this.memoryUserId}`, { headers })
        .pipe(
          catchError((error) => {
            console.error('Error fetching user details:', error);
            return throwError(() => new Error('Failed to load user details'));
          })
        );
    } else {
      return throwError(() => new Error('No authenticated user'));
    }
  }

  private encryptToken(token: string): string {
    return CryptoJS.AES.encrypt(token, this.ENCRYPTION_KEY).toString();
  }

  private decryptToken(encryptedToken: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, this.ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  isTokenExpired(): boolean {
    const timestamp =
      this.memoryTimestamp || localStorage.getItem(this.TIMESTAMP_KEY);
    if (!timestamp) return true;

    const tokenAge = Date.now() - parseInt(timestamp);
    const MAX_TOKEN_AGE = 43200000; // 12 hours in milliseconds
    return tokenAge > MAX_TOKEN_AGE;
  }

  isAuthenticated(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    if (!this._memoryToken) {
      return false;
    }

    if (this.isTokenExpired()) {
      this.logout();
      return false;
    }

    return true;
  }

  logout(): void {
    // Clear memory storage
    this._memoryToken = null;
    this.memoryUserId = null;
    this.memoryTimestamp = null;

    // Clear localStorage
    localStorage.removeItem(this.USER_ID_KEY);
    localStorage.removeItem(this.TIMESTAMP_KEY);
  }
}
