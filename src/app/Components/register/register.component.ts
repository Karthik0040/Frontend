import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInfo } from '../../interface/user-info';
import { HttpErrorResponse } from '@angular/common/http';
import { RegisterService } from '../../Service/register.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule,CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  user: UserInfo = {
    id: null,
    name: '',
    email: '',
    password: '',
    roles: '',
  };

  // New field to capture the confirmation password
  confirmPassword: string = '';

  errorMessage: string = '';

  constructor(private registerService: RegisterService, private router: Router) { }

  onSubmit(registerForm: any) {
    // Check overall form validity
    if (!registerForm.valid) {
      this.errorMessage = 'Please fill out all required fields correctly.';
      return;
    }

    // Check if password and confirmPassword match
    if (this.user.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    // Clear any previous error messages
    this.errorMessage = '';

    this.registerService.registerUser(this.user).subscribe(
      (response: any) => {
        console.log('Type of response:', typeof response);
        console.log('Backend Response:', response);

        // Navigate on the basis of the selected role
        if (this.user.roles === 'Patient') {
          this.router.navigate(['/login']);
        } else if (this.user.roles === 'Doctor') {
          this.router.navigate(['/login']);
        } else {
          console.warn('Unknown role:', this.user.roles);
        }
      },
      (error: HttpErrorResponse) => {
        console.error('Registration Error:', error);

        if (error.status === 409) {
          this.errorMessage = error.error.error || 'Username already exists.';
        } else {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
        }
      }
    );
  }
}
