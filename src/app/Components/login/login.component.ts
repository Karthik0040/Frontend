import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Service/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'login',
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] 
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login({ username: this.username, password: this.password }).subscribe(
      (response) => {
        console.log('Login successful', response);
        // Access token and userId from the response
        const token = response.token;
        const userId = response.userId;
        console.log('Token:', token);
        console.log('User ID:', userId);
        localStorage.setItem("isLoggedIn","true")

        // Get the user role using the getUserRole() method
         const role = this.authService.getUserRole();
        // console.log('Role:', role);

        // // Navigate based on the user's role
        if (role === 'Patient') {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/doctor_home']);
        }
      },
      (error) => {
        console.error('Login failed', error);
        this.errorMessage = 'Invalid username or password';
      }
    );
  }
}
