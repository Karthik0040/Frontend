import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment } from '../interface/appointment';
import { PatientDoctorAppointmentDto } from '../interface/PatientDoctorAppointmentDto';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private baseUrl = 'http://localhost:8765/appointment';

  constructor(private http: HttpClient) { }

  bookAppointment(appointment: Appointment): Observable<Appointment> {
    const url = `${this.baseUrl}/book/${appointment.doctorId}`;
    return this.http.post<Appointment>(url, appointment);
  }

  // New method to get appointment by ID
  getAppointmentById(appointmentId: number): Observable<PatientDoctorAppointmentDto> {
    const url = `${this.baseUrl}/findById/${appointmentId}`;
    return this.http.get<PatientDoctorAppointmentDto>(url);
  }

  getAppointmentsByPatientId(patientId: number): Observable<PatientDoctorAppointmentDto[]> {
    const url = `${this.baseUrl}/findByPatientId/${patientId}`;
    return this.http.get<PatientDoctorAppointmentDto[]>(url);
  }

  deleteAppointment(appointmentId: number): Observable<string> {
    const url = `${this.baseUrl}/delete/${appointmentId}`;
    return this.http.delete(url, { responseType: 'text' });
  }

  getAppointmentsByPatientIdAndStatus(patientId: number, status: string): Observable<PatientDoctorAppointmentDto[]> {
    const url = `${this.baseUrl}/getByStatusPat/${patientId}/${status}`;
    return this.http.get<PatientDoctorAppointmentDto[]>(url);
  }

  // Fetch all appointments by doctor ID
  getAppointmentsByDoctorId(doctorId: number): Observable<PatientDoctorAppointmentDto[]> {
    const url = `${this.baseUrl}/findByDoctorId/${doctorId}`;
    return this.http.get<PatientDoctorAppointmentDto[]>(url);
  }

  // Fetch appointments by doctor ID and status
  getAppointmentsByDoctorIdAndStatus(doctorId: number, status: string): Observable<PatientDoctorAppointmentDto[]> {
    const url = `${this.baseUrl}/getByStatus/${doctorId}/${status}`;
    return this.http.get<PatientDoctorAppointmentDto[]>(url);
  }

  // Accept an appointment
  acceptAppointment(appointmentId: number): Observable<string> {
    const url = `${this.baseUrl}/accept/${appointmentId}`;
    return this.http.put(url, null, { responseType:'text'});
  }

  // Decline an appointment
  declineAppointment(appointmentId: number): Observable<string> {
    const url = `${this.baseUrl}/decline/${appointmentId}`;
    return this.http.put(url, null, { responseType: 'text' });
  }

  getTodaysAppointments(doctorId: number, date: string): Observable<PatientDoctorAppointmentDto[]> {
    const url = `${this.baseUrl}/getTodaysApp/${doctorId}?date=${date}`;
    return this.http.get<PatientDoctorAppointmentDto[]>(url);
  }
}
