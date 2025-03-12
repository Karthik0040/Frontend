import { Component, OnInit } from '@angular/core';
import { PatientDoctorAppointmentDto } from '../../interface/PatientDoctorAppointmentDto';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { AppointmentService } from '../../Service/appointment-service.service';

@Component({
  selector: 'app-today-app-details',
  imports: [RouterModule,FormsModule,CommonModule,NavbarComponent],
  templateUrl: './today-app-details.component.html',
  styleUrl: './today-app-details.component.css',
  providers:[DatePipe]
})
export class TodayAppDetailsComponent implements OnInit {
  doctorId: number = 0;
  appointments: PatientDoctorAppointmentDto[] = [];
  errorMessage: string | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Retrieve doctorId from localStorage
    const storedDoctorId = localStorage.getItem('user_id');
    if (storedDoctorId) {
      const parsedDoctorId = parseInt(storedDoctorId, 10);
      if (!isNaN(parsedDoctorId)) {
        this.doctorId = parsedDoctorId;
        console.log('Retrieved Doctor ID from localStorage:', this.doctorId);

        const today = new Date().toISOString().split('T')[0];

        this.appointmentService.getTodaysAppointments(this.doctorId, today).subscribe(
          (data) => {
            this.appointments = data;
          },
          (error) => {
            console.error("Error fetching today's appointments", error);
            this.errorMessage = "An error occurred while fetching today's appointments.";
          }
        );
      } else {
        console.error('Invalid Doctor ID in localStorage.');
        // Handle invalid ID, e.g., redirect to login or show an error message
        this.router.navigate(['/login']);
      }
    } else {
      console.error('Doctor ID not found in localStorage.');
      // Handle missing ID, e.g., redirect to login or show an error message
      this.router.navigate(['/login']);
    }
  }

  navigateToAddPrescription(appointmentId: number): void {
    this.router.navigate(['/addPres', appointmentId]);
  }
}