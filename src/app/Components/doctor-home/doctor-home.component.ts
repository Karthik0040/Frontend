// doctor-home.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { DoctorDto } from '../../interface/PatientDoctorAppointmentDto';
import { catchError, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-doctor-home',
  templateUrl: './doctor-home.component.html',
  styleUrls: ['./doctor-home.component.css'],
  imports:[RouterModule,FooterComponent,NavbarComponent]
})
export class DoctorHomeComponent{
  userId: number;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  redirectToAppointments() {
    const userId = localStorage.getItem('user_id');
    if (userId) {
      const id = parseInt(userId, 10);

      this.http.get<DoctorDto>(`http://localhost:8765/doctor/findbyId/${id}`)
        .pipe(
          catchError(error => {
            if (error.status === 404 || error.error?.message === 'Doctor not present') {
              // Navigate to doctor-register if doctor not found
              this.router.navigate(['/doctor_register']);
            } else {
              // Handle other errors
              console.error('An error occurred:', error);
            }
            return of(null); // Return an observable
          })
        )
        .subscribe(doctor => {
          if (doctor) {
            // DOCTOR found, proceed to appointment booking
            this.router.navigate(['/viewTodaysApp']);
          }
        });
    } else {
      // Handle case when user_id is not in localStorage
      console.error('User ID not found in localStorage.');
      // Optionally, navigate to login or show an error message
      this.router.navigate(['/login']);
    }
  }

}