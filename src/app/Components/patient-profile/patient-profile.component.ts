import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { PatientInfo } from '../../interface/user-info';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css'],
  imports:[NavbarComponent,CommonModule]
})
export class PatientProfileComponent implements OnInit {
  patientInfo: PatientInfo | null = null;
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    // Retrieve patient ID from localStorage
    const userId = localStorage.getItem('user_id');
    if (userId) {
      const id = parseInt(userId, 10);
      // Call the endpoint to fetch patient details.
      this.http.get<PatientInfo>(`http://localhost:8765/patient/findByPatientId/${id}`)
        .pipe(
          catchError(error => {
            // If patient is not found (404 or error message 'Patient not present'), redirect.
            if (error.status === 404 || error.error?.message === 'Patient not present') {
              this.router.navigate(['/patient_register']);
            } else {
              console.error('An unexpected error occurred:', error);
              this.errorMessage = 'An unexpected error occurred. Please try again later.';
            }
            // Return an observable with null.
            return of(null);
          })
        )
        .subscribe((patient) => {
          if (patient) {
            this.patientInfo = patient;
          }
        });
    } else {
      // If no user_id found, navigate to login.
      console.error('User ID not found in localStorage.');
      this.router.navigate(['/login']);
    }
  }
}
