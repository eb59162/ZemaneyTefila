import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAvailableCities(): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.apiUrl}/IsraelLocation/available-cities`
    );
  }
}
