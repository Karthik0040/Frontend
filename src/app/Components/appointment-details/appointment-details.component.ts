import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PatientDoctorAppointmentDto } from '../../interface/PatientDoctorAppointmentDto';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { AppointmentService } from '../../Service/appointment-service.service';

@Component({
  selector: 'app-appointment-details',
  imports: [CommonModule, RouterModule, FormsModule, NavbarComponent],
  templateUrl: './appointment-details.component.html',
  styleUrls: ['./appointment-details.component.css']
})
export class AppointmentDetailsComponent implements OnInit {
  patientId: number = 0;
  selectedStatus: string = '';
  selectedDate: string = ''; // New property for date filtering (expects "YYYY-MM-DD")
  appointments: PatientDoctorAppointmentDto[] = [];
  searched: boolean = false;
  errorMessage: string | null = null;

  constructor(private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    // Retrieve patientId from localStorage
    const storedPatientId = localStorage.getItem('user_id');
    if (storedPatientId) {
      this.patientId = +storedPatientId;
      console.log('Retrieved Patient ID from localStorage:', this.patientId);
      // Optionally you can also parse using parseInt if needed:
      // const parsedUserId = parseInt(storedPatientId, 10);
    } else {
      console.error('Patient ID not found in localStorage.');
      // Optionally redirect to login or show an error message.
    }
  }

  searchAppointments(): void {
    this.searched = false;
    this.appointments = [];

    if (this.patientId > 0) {
      if (this.selectedStatus) {
        // Fetch appointments by patient ID and status
        this.appointmentService.getAppointmentsByPatientIdAndStatus(this.patientId, this.selectedStatus)
          .subscribe(
            (data: PatientDoctorAppointmentDto[]) => {
              this.appointments = data;
              this.applyDateFilter();
              this.searched = true;
            },
            (error) => {
              console.error('Error fetching appointments by status:', error);
              this.searched = true;
            }
          );
      } else {
        // Fetch all appointments by patient ID
        this.appointmentService.getAppointmentsByPatientId(this.patientId)
          .subscribe(
            (data: PatientDoctorAppointmentDto[]) => {
              this.appointments = data;
              this.applyDateFilter();
              this.searched = true;
            },
            (error) => {
              console.error('Error fetching appointments:', error);
              this.searched = true;
            }
          );
      }
    } else {
      alert('Patient ID not found. Please log in again.');
      // Optionally redirect the user to login or another appropriate page.
    }
  }

  /**
   * applyDateFilter - If selectedDate is provided, filter appointments to only include
   * those whose date (formatted as "YYYY-MM-DD") matches the selected date.
   */
  applyDateFilter(): void {
    if (this.selectedDate && this.selectedDate.trim() !== '') {
      this.appointments = this.appointments.filter(app => {
        const appDate = new Date(app.date).toISOString().split('T')[0];
        return appDate === this.selectedDate;
      });
    }
  }

  /**
   * deleteAppointment - Cancels (deletes) the appointment with the given appointmentId.
   * Only available if the appointment date is today or in the future.
   */
  deleteAppointment(appointmentId: number): void {
    if (confirm('Are you sure you want to delete this appointment?')) {
      this.appointmentService.deleteAppointment(appointmentId)
        .subscribe(
          (response: string) => {
            // Remove the deleted appointment from the list
            this.appointments = this.appointments.filter(app => app.appId !== appointmentId);
            alert(response); // Expected to display "Deleted Successfully"
          },
          (error) => {
            console.error('Error deleting appointment:', error);
            alert('Failed to delete the appointment.');
          }
        );
    }
  }

  /**
   * isPresentOrFuture - Helper method to determine whether an appointment date
   * is today or in the future.
   * @param appointmentDate - The date string from the appointment.
   * @returns boolean - True if the appointment date is today or in the future; otherwise false.
   */
  isPresentOrFuture(appointmentDate: string): boolean {
    const appDate = new Date(appointmentDate);
    const today = new Date();
    // Set hours, minutes, seconds, and milliseconds to 0 for both dates to compare only dates.
    appDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return appDate.getTime() >= today.getTime();
  }
}
