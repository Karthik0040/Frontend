import { Component, OnInit } from '@angular/core';
import { Doctor } from '../../interface/doctor';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { DoctorService } from '../../Service/doctor-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorsComponent implements OnInit {
  doctors: Doctor[] = [];
  showDoctors: boolean = false;

  constructor(private doctorService: DoctorService, private router: Router) { }

  ngOnInit(): void {
    // Automatically fetch the list of doctors on component initialization
    this.onViewDoctors();
  }

  onViewDoctors(): void {
    // Fetch doctors only if they haven't been loaded yet
    if (!this.showDoctors) {
      this.doctorService.getDoctors().subscribe(
        (data: Doctor[]) => {
          this.doctors = data;
          this.showDoctors = true;
        },
        error => {
          console.error("Error fetching doctors:", error);
        }
      );
    } else {
      this.showDoctors = !this.showDoctors;
    }
  }

  // Method called when "Book Appointment" button is clicked
  bookAppointment(doctor: Doctor): void {
    // Navigate to the book appointment page, passing the doctor's ID as a route parameter.
    this.router.navigate(['/book-appointment', doctor.doctorId]);
  }
}
