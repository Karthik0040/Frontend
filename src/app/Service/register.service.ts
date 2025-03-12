import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PatientInfo, UserInfo } from '../interface/user-info';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  private apiUrl = 'http://localhost:8765/auth/new';
  private apiUrl2 = 'http://localhost:8765/patient/userregister';

  constructor(private http: HttpClient) { }

  // In your register.service.ts
  // register.service.ts
  registerUser(userData: UserInfo): Observable<any> {
    return this.http.post<any>(this.apiUrl, userData);
  }
  registerPatient(userId: number, patientData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl2}/${userId}`, patientData);
  }

  registerDoctor(userId: number, doctorData: any): Observable<string> {
    const url = `http://localhost:8765/doctor/add/${userId}`;
    return this.http.post(url, doctorData, { responseType: 'text' });

  }

  getPatientById(id: number) {
    return this.http.get<PatientInfo>(`http://localhost:8765/patient/findByPatientId/${id}`);
  }
  
}
