import { Component, OnInit } from '@angular/core';
import { Prescription } from '../../interface/prescription';
import { Router, RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrescriptionService } from '../../Service/prescription.service';
import { RegisterService } from '../../Service/register.service';
import { DoctorService } from '../../Service/doctor-service.service';
import { DoctorInfo, PatientInfo } from '../../interface/user-info';

@Component({
  selector: 'app-prescription',
  templateUrl: './prescription.component.html',
  styleUrls: ['./prescription.component.css'],
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [DatePipe],
})
export class PrescriptionComponent implements OnInit {
  patientId: number = 0; // Stores the logged-in patient's ID
  prescription: Prescription[] | null = null; // Array of prescriptions
  patient: PatientInfo = {
    patientID: null,
    emailID: '',
    patientName: '',
    patientAge: null,
    mobile_number: '',
    gender: '',
  }; // Patient details

  doctorNameMap: { [key: number]: string } = {}; // Map to store doctor names by ID
  errorMessage: string | null = null; // Error message if something goes wrong
  noPrescriptionFound: boolean = false; // Flag if no prescription is found

  constructor(
    private prescriptionService: PrescriptionService,
    private router: Router,
    private registerService: RegisterService,
    private doctorService: DoctorService
  ) {}

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
          // Fetch prescriptions for the patient
          this.prescriptionService.getPrescriptionByPatientId(this.patientId).subscribe(
            (data: Prescription[]) => {
              if (data && data.length > 0) {
                this.prescription = data;

                // Fetch patient details
                this.registerService.getPatientById(this.patientId).subscribe(
                  (response: any) => {
                    this.patient = response; // Assign the full patient object
                    console.log('Patient Name:', this.patient.patientName); // Debug log
                  },
                  (error) => {
                    console.error('Error fetching patient details:', error);
                    this.errorMessage = 'Could not fetch patient details.';
                  }
                );

                // Fetch doctor details for each prescription
                this.prescription.forEach((presc: Prescription) => {
                  if (presc.doctorid) {
                    this.doctorService.findById(presc.doctorid).subscribe(
                      (response: DoctorInfo) => {
                        // Map doctor name to the doctor ID
                        this.doctorNameMap[presc.doctorid] = response.name;
                        console.log(`Doctor Name for ID ${presc.doctorid}:`, response.name); // Debug log
                      },
                      (error) => {
                        console.error(`Error fetching doctor details for ID ${presc.doctorid}:`, error);
                        this.doctorNameMap[presc.doctorid] = 'Unknown'; // Fallback value
                      }
                    );
                  }
                });

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
