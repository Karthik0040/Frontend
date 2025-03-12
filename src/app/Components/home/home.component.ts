import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { PatientDto } from '../../interface/PatientDoctorAppointmentDto';

@Component({
  selector: 'app-home',
  imports: [RouterModule,FooterComponent,NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
    constructor(
      private http: HttpClient,
      private router: Router
    ) {}
  
    redirectToAppointments() {
      const userId = localStorage.getItem('user_id');
      if (userId) {
        const id = parseInt(userId, 10);
  
        this.http.get<PatientDto>(`http://localhost:8765/patient/findByPatientId/${id}`)
          .pipe(
            catchError(error => {
              if (error.status === 404 || error.error?.message === 'Patient not present') {
                // Navigate to patient-register if patient not found
                this.router.navigate(['/patient_register']);
              } else {
                // Handle other errors
                console.error('An error occurred:', error);
              }
              return of(null); // Return an observable
            })
          )
          .subscribe(patient => {
            if (patient) {
              // Patient found, proceed to appointment booking
              this.router.navigate(['/appointment']);
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