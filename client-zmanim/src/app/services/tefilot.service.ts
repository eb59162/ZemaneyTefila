import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TefilosTime } from '../models/tefilos-time.model';
import { HalachicTimeDictionary } from '../models/types';
import { AuthService } from '../auth/services/auth.service';
import { environment } from '../../environments/environment';
import { HolidayTefilos } from '../models/holiday-tefilos.model';

@Injectable({
  providedIn: 'root',
})
export class TefilotService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.memoryToken;
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
  getPrayers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/enums/TefilaName`);
  }

  getHalachicTimes(): Observable<HalachicTimeDictionary> {
    return this.http.get<HalachicTimeDictionary>(
      `${this.apiUrl}/HalachicTime/times`
    );
  }
  getTefilosTimesByUserId(userId: number): Observable<TefilosTime[]> {
    return this.http.get<TefilosTime[]>(
      `${this.apiUrl}/TefilosTime/user/${userId}`,
      { headers: this.getAuthHeaders() }
    );
  }
 saveTefilosTimes(holidayTefilos: HolidayTefilos[]): Observable<any> {
  return this.http.post(`${this.apiUrl}/TefilosTime/savemany`, holidayTefilos);
  }
  downloadShabbatSchedule(userId: number): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/Document/download-shabbat-schedule-word/${userId}`,
      { headers: this.getAuthHeaders(), responseType: 'blob' }
    );
  }
  downloadShabbatScheduleExcel(userId: number): Observable<Blob> {
    return this.http.get(
      `${this.apiUrl}/Document/download-shabbat-schedule-excel/${userId}`,
      { headers: this.getAuthHeaders(), responseType: 'blob' }
    );
  }
   getChagimDates(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/TefilosTime/holiday_dates`, {
      headers: this.getAuthHeaders()
    });}
}