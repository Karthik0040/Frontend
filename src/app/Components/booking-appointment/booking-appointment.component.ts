import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Appointment } from '../../interface/appointment';
import { FormsModule } from '@angular/forms';
import { PatientDoctorAppointmentDto } from '../../interface/PatientDoctorAppointmentDto';
import { CommonModule } from '@angular/common';
import { AppointmentService } from '../../Service/appointment-service.service';

@Component({
  selector: 'app-booking-appointment',
  templateUrl: './booking-appointment.component.html',
  styleUrls: ['./booking-appointment.component.css'],
  // If you're using standalone components (Angular 14+), uncomment the next line
  // standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
})
export class BookingAppointmentComponent implements OnInit {
  appointment: Appointment = {
    appointmentId: null,
    patientId: null,
    doctorId: null,
    date: null,
    time: null,
    status: 'Pending',
  };

  // Holds the details of the booked appointment
  bookedAppointmentDetails: PatientDoctorAppointmentDto | null = null;

  // Error message
  errorMessage: string = '';
  minDate: string = '';


  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // Retrieve patientId from localStorage
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      const parsedUserId = parseInt(storedUserId, 10);
      if (!isNaN(parsedUserId)) {
        this.appointment.patientId = parsedUserId;
        console.log('Patient ID retrieved from localStorage:', this.appointment.patientId);
      } else {
        console.error('Invalid Patient ID in localStorage.');
        this.errorMessage = 'Invalid patient ID found. Please log in again.';
        // Optionally redirect to login or another page
        this.router.navigate(['/login']);
        return;
      }
    } else {
      console.error('Patient ID not found in localStorage.');
      this.errorMessage = 'Patient ID not found. Please log in to book an appointment.';
      // Optionally redirect to login or another page
      this.router.navigate(['/login']);
      return;
    }
    // Set minDate to today's date in the format 'YYYY-MM-DD'
    this.minDate = new Date().toISOString().split('T')[0];
  

    // Retrieve doctorId from route parameters
    this.route.paramMap.subscribe((params) => {
      const doctorIdParam = params.get('doctorId');
      if (doctorIdParam) {
        this.appointment.doctorId = +doctorIdParam;
        console.log('Doctor ID retrieved from route:', this.appointment.doctorId);
      } else {
        console.error('No doctor ID found in route parameters.');
        this.errorMessage = 'No doctor ID found. Cannot book appointment without a doctor ID.';
      }
    });
  }

  // Method to book an appointment and then get details
  bookAppointment() {
    // Ensure doctorId and patientId are set
    if (!this.appointment.doctorId) {
      this.errorMessage = 'Doctor ID is missing.';
      return;
    }
    if (!this.appointment.patientId) {
      this.errorMessage = 'Patient ID is missing.';
      return;
    }

    this.appointmentService.bookAppointment(this.appointment).subscribe(
      (response) => {
        console.log('Appointment booked successfully:', response);

        // Assuming the response contains the appointment ID
        const appointmentId = response.appointmentId;

        if (appointmentId) {
          // Now fetch the appointment details by ID
          this.getAppointmentDetails(appointmentId);
        } else {
          console.error('No appointment ID returned after booking.');
          this.errorMessage = 'No appointment ID returned after booking.';
        }
      },
      (error) => {
        console.error('Error booking appointment:', error);
        this.errorMessage = 'Date must be in future!! Try booking for future date';
      }
    );
  }

  // Method to get appointment details by ID
  getAppointmentDetails(appointmentId: number) {
    this.appointmentService.getAppointmentById(appointmentId).subscribe(
      (data) => {
        this.bookedAppointmentDetails = data;
        this.errorMessage = '';
        console.log('Fetched appointment details:', data);
      },
      (error) => {
        console.error('Error fetching appointment details:', error);
        this.errorMessage = 'An error occurred while fetching appointment details.';
      }
    );
  }
}
