import { Component, OnInit } from '@angular/core';
import { DoctorInfo } from '../../interface/user-info';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';
import { RegisterService } from '../../Service/register.service';

@Component({
  selector: 'app-doctor-register',
  imports: [FormsModule,NavbarComponent],
  templateUrl: './doctor-register.component.html',
  styleUrl: './doctor-register.component.css'
})
export class DoctorRegisterComponent implements OnInit {
  doctor:DoctorInfo={
    doctorId:null,
    emailId: '',
    name:'',
    mobile_number: '',
    specialization: '',
    gender: ''
  };

  constructor(
    private router: Router,
    private registerService: RegisterService
  ) {}

  ngOnInit() {
    // Retrieve userId from localStorage
    const storedUserId = localStorage.getItem('user_id');
    if (storedUserId) {
      this.doctor.doctorId = +storedUserId;
      console.log('Retrieved User ID from localStorage:', this.doctor.doctorId);
    } else {
      console.error('User ID not found in localStorage.');
      // Optionally, redirect to login or show an error message
      this.router.navigate(['/login']);
    }
  }

  onSubmit() {
    const doctorData = {
      specialization: this.doctor.specialization,
      mobile_number: this.doctor.mobile_number,
      gender: this.doctor.gender,
    };

    this.registerService.registerDoctor(this.doctor.doctorId, doctorData).subscribe(
      (response) => {
        console.log('Doctor registered successfully:', response);
        // Redirect to login page upon success
        this.router.navigate(['/doctor_home']);
      },
      (error) => {
        // Handle errors here
        console.error('Error registering doctor:', error);
      }
    );
  }
}