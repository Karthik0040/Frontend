import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Doctor, FilteredDoctor } from '../../interface/doctor';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { DoctorService } from '../../Service/doctor-service.service';

@Component({
  selector: 'app-appointment',
  standalone: true, // If you are using Angular standalone components
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent {
  specialization: string = '';
  doctors: Doctor[] = [];
  searched: boolean = false;
  errorMessage: string = '';

  constructor(private doctorService: DoctorService, private router: Router) {}

  searchDoctors(): void {
    if (this.specialization.trim() == '') {
      // Optionally notify the user to enter a specialization.
      this.errorMessage = "Please select a specialization.";
      return;
    }

    // Reset previous search state
    this.errorMessage = '';
    this.doctors = [];
    this.searched = false;

    this.doctorService.getDoctorsBySpecialization(this.specialization).subscribe(
      (data: Doctor[]) => {
        this.doctors = data;
        this.searched = true;
        // Optionally show a "no results" message if the list is empty.
        if (data.length === 0) {
          this.errorMessage = `Sorry!! We dont have any doctors found for specialization "${this.specialization}".`;
        }
      },
      (error) => {
        console.error('Error fetching doctors by specialization:', error);
        // Capture error message from the API response
        // this.errorMessage = error.error?.message || 'Error fetching doctors';
        this.searched = true;
      }
    );
  }

  navigateToBookAppointment(doctorId: number): void {
    this.router.navigate(['/book-appointment', doctorId]);
  }
}
