import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Service/auth.service';
import { SharedService } from '../../Service/shared.service';
import { RegisterService } from '../../Service/register.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterModule, FormsModule, CommonModule]
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = localStorage.getItem("isLoggedIn") === "true";
  role: string | null = null;
  isCollapsed: boolean = true;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private cdRef: ChangeDetectorRef,
    private authService: AuthService,
    private patientService: RegisterService
  ) {}

  ngOnInit() {
    this.updateLoginStatus();
    this.sharedService.loginStatus$.subscribe(() => {
      this.updateLoginStatus();
      this.cdRef.detectChanges();
    });
  }

  updateLoginStatus() {
    const token = localStorage.getItem('access_token');
    this.isLoggedIn = !!token;
    this.role = this.authService.getUserRole();
  }

  toggleNavbar() {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    this.isLoggedIn = false;
    this.role = null;
    this.router.navigate(['/login']);
    this.sharedService.triggerChangeLogin();
  }

  openPatientProfile() {
    const patientIdStr = localStorage.getItem('user_id');
    if (patientIdStr) {
      const patientId = parseInt(patientIdStr, 10);
      this.patientService.getPatientById(patientId).subscribe(
        (patient) => {
          if (patient) {
            this.router.navigate(['/patient-profile']);
          }
        },
        (error) => {
          console.error('Error fetching patient details:', error);
          if (error.status === 404 || error.error?.message === 'Patient not present') {
            this.router.navigate(['/patient_register']);
          }
        }
      );
    } else {
      console.error('Patient ID not found in localStorage.');
      this.router.navigate(['/login']);
    }
  }
}
