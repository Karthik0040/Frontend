import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Prescription } from '../interface/prescription';
import { Medicine } from '../interface/medicine';


@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private baseUrl = 'http://localhost:8765/prescription'; // Adjust according to your backend

  constructor(private http: HttpClient) {}

  // Fetch prescription by patient ID
  getPrescriptionByPatientId(patientId: number): Observable<any[]> {
    const url = `${this.baseUrl}/show/${patientId}`;
    return this.http.get<Prescription[]>(url);
  }

  addMedicine(medicine: Medicine, appointmentId: number): Observable<Medicine> {
    const url = `${this.baseUrl}/addMedicine/${appointmentId}`;
    return this.http.post<Medicine>(url, medicine);
  }

  // Get medicines by appointment ID
  getMedicinesByAppointmentId(appointmentId: number): Observable<Medicine[]> {
    const url = `${this.baseUrl}/getMedicines/${appointmentId}`;
    return this.http.get<Medicine[]>(url);
  }

  // Add prescription
  addPrescription(appointmentId: number, prescription: Prescription): Observable<Prescription> {
    const url = `${this.baseUrl}/add/${appointmentId}`;
    return this.http.post<Prescription>(url, prescription);
  }

  // Get prescription by appointment ID
  getPrescriptionByAppointmentId(appointmentId: number): Observable<Prescription> {
    const url = `${this.baseUrl}/getByAppointmentId/${appointmentId}`;
    return this.http.get<Prescription>(url);
  }
}
