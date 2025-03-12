import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Medicine } from '../../interface/medicine';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { PrescriptionService } from '../../Service/prescription.service';

@Component({
  selector: 'AddPrescriptionComponent',
  imports: [FormsModule,CommonModule,RouterModule,NavbarComponent],
  providers:[DatePipe],
  templateUrl: './add-prescription.component.html',
  styleUrl: './add-prescription.component.css'
})
export class AddPrescriptionComponent implements OnInit {
  appointmentId: number;
  medicine: Medicine;
  medicines: Medicine[] = [];
  message: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private prescriptionService: PrescriptionService,
    private router: Router
  ) {
    this.medicine = {
      mid:null,
      aid: 0,
      name: '',
      tabletCount: 0,
      morning: false,
      afternoon: false,
      night: false,
    };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.appointmentId = +params.get('appointmentId')!;
      // this.medicine.aid = this.appointmentId;
      this.loadMedicines();
    });
  }

  loadMedicines(): void {
    this.prescriptionService.getMedicinesByAppointmentId(this.appointmentId).subscribe(
      (data) => {
        this.medicines = data;
      },
      (error) => {
        console.error('Error fetching medicines', error);
      }
    );
  }

  addMedicine(): void {
    if (!this.medicine.name || this.medicine.tabletCount <= 0) {
      this.message = 'Please provide valid medicine details.';
      return;
    }

    this.prescriptionService
      .addMedicine(this.medicine, this.appointmentId)
      .subscribe(
        (data) => {
          this.medicine = {
            mid:null,
            aid: this.appointmentId,
            name: '',
            tabletCount: 0,
            morning: false,
            afternoon: false,
            night: false,
          };
          this.message = 'Medicine added successfully.';
          this.loadMedicines();
        },
        (error) => {
          console.error('Error adding medicine', error);
          this.message = 'Error adding medicine.';
        }
      );
  }

  addPrescription(): void {
    const prescription = {
      aid: this.appointmentId,
      patientid: null, // Set actual patient ID
      doctorid: null, // Set actual doctor ID
      medicine: this.medicines,
      date: new Date().toISOString().split('T')[0],
    };

    this.prescriptionService
      .addPrescription(this.appointmentId, prescription)
      .subscribe(
        (data) => {
          this.message = 'Prescription saved successfully.';
          // Optionally navigate to prescription details
        },
        (error) => {
          console.error('Error saving prescription', error);
          this.message = 'Error saving prescription.';
        }
      );
  }

  printPrescription(): void {
    this.router.navigate(['/view-prescription', this.appointmentId]);
  }
}