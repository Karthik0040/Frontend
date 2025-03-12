import { Component, OnInit } from '@angular/core';
import { Prescription } from '../../interface/prescription';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrescriptionService } from '../../Service/prescription.service';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [DatePipe]
})
export class PrescriptionComponent implements OnInit {
  patientId: number = 0;
  prescription: Prescription[] | null = null;
  errorMessage: string | null = null;
  noPrescriptionFound: boolean = false;

  constructor(
    private prescriptionService: PrescriptionService,
    private router: Router
  ) { }

  ngOnInit() {
    // Retrieve patientId from localStorage
    const storedPatientId = localStorage.getItem('user_id');
    if (storedPatientId) {
      const parsedUserId = parseInt(storedPatientId, 10);
      if (!isNaN(parsedUserId)) {
        this.patientId = parsedUserId;
        console.log('Retrieved Patient ID from localStorage:', this.patientId);

        // Reset previous state
        this.errorMessage = null;
        this.prescription = null;
        this.noPrescriptionFound = false;

        if (this.patientId > 0) {
          this.prescriptionService.getPrescriptionByPatientId(this.patientId).subscribe(
            (data: Prescription[]) => {
              // The service returns an array of prescriptions.
              // Check if the array has any elements.
              if (data && data.length > 0) {
                this.prescription = data;
                this.noPrescriptionFound = false;
              } else {
                // No prescription found (empty array)
                this.prescription = null;
                this.noPrescriptionFound = true;
              }
            },
            (error) => {
              console.error('Error fetching prescription:', error);
              this.prescription = null;
              this.noPrescriptionFound = true;
              // Use a custom error message instead of the backend error object.
              this.errorMessage = 'No Prescription Found.';
            }
          );
        } else {
          this.errorMessage = 'Invalid Patient ID.';
        }
      } else {
        console.error('Invalid Patient ID in localStorage.');
        this.router.navigate(['/login']);
      }
    } else {
      console.error('Patient ID not found in localStorage.');
      this.router.navigate(['/login']);
    }
  }
}
