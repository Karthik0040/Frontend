import { Component, OnInit } from '@angular/core';
import { PatientDoctorAppointmentDto } from '../../interface/PatientDoctorAppointmentDto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { AppointmentService } from '../../Service/appointment-service.service';

@Component({
  selector: 'app-view-doctor-app',
  imports: [FormsModule, CommonModule, RouterModule, NavbarComponent],
  templateUrl: './view-doctor-app.component.html',
  styleUrls: ['./view-doctor-app.component.css']
})
export class ViewDoctorAppComponent implements OnInit {
  doctorId: number = 0;
  selectedStatus: string = '';
  selectedDate: string = ''; // Expecting format "YYYY-MM-DD" from the date input
  appointments: PatientDoctorAppointmentDto[] = []; // All appointments fetched from the server.
  filteredAppointments: PatientDoctorAppointmentDto[] = []; // Appointments shown after filtering.
  searched: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Retrieve the doctor ID from localStorage
    const storedDoctorId = localStorage.getItem('user_id');
    if (storedDoctorId) {
      const parsedDoctorId = parseInt(storedDoctorId, 10);
      if (!isNaN(parsedDoctorId)) {
        this.doctorId = parsedDoctorId;
        console.log('Retrieved Doctor ID from localStorage:', this.doctorId);
        // Fetch all appointments on initialization
        this.getAppointments();
      } else {
        console.error('Invalid Doctor ID in localStorage.');
        this.router.navigate(['/login']);
      }
    } else {
      console.error('Doctor ID not found in localStorage.');
      this.router.navigate(['/login']);
    }
  }

  /**
   * getAppointments(): Fetches all appointments for the given doctor.
   * Once fetched the list is stored in `appointments` and then filtered.
   */
  getAppointments(): void {
    this.appointmentService.getAppointmentsByDoctorId(this.doctorId).subscribe(
      (data: PatientDoctorAppointmentDto[]) => {
        this.appointments = data;
        this.searched = true;
        // Apply the frontend filters to update filteredAppointments.
        this.filterAppointments();
      },
      (error) => {
        console.error('Error fetching appointments:', error);
        this.errorMessage = 'Error fetching appointments.';
        this.appointments = [];
        this.filteredAppointments = [];
        this.searched = true;
      }
    );
  }

  /**
   * filterAppointments(): Filters the list of appointments based on the selected status and date.
   * If no filter is set, all appointments are returned.
   */
  filterAppointments(): void {
    this.filteredAppointments = this.appointments.filter((appointment) => {
      // If selectedStatus is defined (non-empty), check that it matches; otherwise, let it pass.
      const statusMatch = this.selectedStatus ? (appointment.status === this.selectedStatus) : true;

      // If selectedDate is set, 
      // convert appointment.date to a formatted string ("YYYY-MM-DD") and compare.
      let dateMatch = true;
      if (this.selectedDate) {
        const appDate = new Date(appointment.date).toISOString().split('T')[0];
        dateMatch = appDate === this.selectedDate;
      }
      return statusMatch && dateMatch;
    });
  }

  /**
   * Event handler for status filter changes.
   */
  onStatusChange(): void {
    this.filterAppointments();
  }

  /**
   * Event handler for date filter changes.
   */
  onDateChange(): void {
    this.filterAppointments();
  }

  /**
   * acceptAppointment(): Calls the appointment service to accept the appointment.
   * @param appointmentId - The ID of the appointment being accepted.
   */
  acceptAppointment(appointmentId: number): void {
    this.appointmentService.acceptAppointment(appointmentId).subscribe(
      (response: string) => {
        alert(response); // e.g., "Accepted Successfully"
        this.updateAppointmentStatus(appointmentId, 'Accepted');
      },
      (error) => {
        console.error('Error accepting appointment:', error);
        alert('Failed to accept the appointment.');
      }
    );
  }

  /**
   * declineAppointment(): Calls the appointment service to decline the appointment.
   * @param appointmentId - The ID of the appointment being declined.
   */
  declineAppointment(appointmentId: number): void {
    this.appointmentService.declineAppointment(appointmentId).subscribe(
      (response: string) => {
        alert(response); // e.g., "Declined Successfully"
        this.updateAppointmentStatus(appointmentId, 'Declined');
      },
      (error) => {
        console.error('Error declining appointment:', error);
        alert('Failed to decline the appointment.');
      }
    );
  }

  /**
   * updateAppointmentStatus(): Updates the status of an appointment locally so the UI reflects the change.
   * @param appointmentId - The ID of the appointment to update.
   * @param status - The new status for the appointment.
   */
  updateAppointmentStatus(appointmentId: number, status: string): void {
    const appointment = this.appointments.find(app => app.appId === appointmentId);
    if (appointment) {
      appointment.status = status;
      // Reapply filters to update the displayed list.
      this.filterAppointments();
    }
  }
}
