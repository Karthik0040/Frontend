import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctor } from '../interface/doctor';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {

  private apiUrl = 'http://localhost:8765/doctor/getAll';
  private apiUrl2 = 'http://localhost:8765/doctor/listOfDoctorsBySpec';
  private apiUrl3='http://localhost:8765/doctor';

  constructor(private http: HttpClient) {}
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  getDoctorsBySpecialization(specialization: string): Observable<Doctor[]> {
    const url = `${this.apiUrl2}/${encodeURIComponent(specialization)}`;
    console.log('Requesting URL:', url); // For debugging purposes
    return this.http.get<Doctor[]>(url);
  }

  findById(doctorId: number): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl3}/findById/${doctorId}`);
  }

}
