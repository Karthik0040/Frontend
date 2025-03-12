import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientInfo } from '../../interface/user-info';
import { NavbarComponent } from '../navbar/navbar.component';
import { RegisterService } from '../../Service/register.service';

@Component({
  selector: 'app-patient-register',
  templateUrl: './patient-register.component.html',
  styleUrls: ['./patient-register.component.css'],
  imports:[FormsModule,NavbarComponent]
})
export class PatientRegisterComponent implements OnInit {
  patient:PatientInfo={
    patientID: null,
    emailID: '',
    patientName: '',
    patientAge: null,
    mobile_number: '',
    gender:''
  };

  constructor(
    private router: Router,
    private registerService: RegisterService
  ) {}

  ngOnInit() {
    // Retrieve userId from localStorage
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      this.patient.patientID = +storedUserId;
      console.log('Retrieved User ID from localStorage:', this.patient.patientID);
    } else {
      console.error('User ID not found in localStorage.');
      // Optionally, redirect to login or show an error message
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    const patientData = {
      patientAge: this.patient.patientAge,
      mobile_number: this.patient.mobile_number,
      gender: this.patient.gender,
    };

    this.registerService.registerPatient(this.patient.patientID, patientData).subscribe(
      (response) => {
        console.log('Patient registered successfully:', response);
        // Redirect to login page upon success
        this.router.navigate(['/home']);
      },
      (error) => {
        // Handle errors here
        console.error('Error registering patient:', error);
      }
    );
  }
}