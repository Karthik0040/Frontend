import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { DoctorRegisterComponent } from './Components/doctor-register/doctor-register.component';
import { PatientRegisterComponent } from './Components/patient-register/patient-register.component';
import { AppointmentComponent } from './Components/appointment/appointment.component';
import { PrescriptionComponent } from './Components/prescription/prescription.component';
import { DoctorsComponent } from './Components/viewDoctors/doctor.component';
import { HomeComponent } from './Components/home/home.component';
import { BookingAppointmentComponent } from './Components/booking-appointment/booking-appointment.component';
import { AppointmentDetailsComponent } from './Components/appointment-details/appointment-details.component';
import { TodayAppDetailsComponent } from './Components/today-app-details/today-app-details.component';
import { ViewDoctorAppComponent } from './Components/view-doctor-app/view-doctor-app.component';
import { ViewPrescriptionComponent } from './Components/view-prescription/view-prescription.component';
import { DoctorHomeComponent } from './Components/doctor-home/doctor-home.component';
import { authGuardGuard } from './auth-guard.guard';
import { AddPrescriptionComponent } from './Components/add-prescription/add-prescription.component';
import { PatientProfileComponent } from './Components/patient-profile/patient-profile.component';


export const routes: Routes = [
    {
        path:"",
        component:HomeComponent
    },
    {
        path:"register",
        component:RegisterComponent
    },
    {
        path:"doctor_register",
        component:DoctorRegisterComponent,
        canActivate: [authGuardGuard]
    },
    {
        path:"patient_register",
        component:PatientRegisterComponent,
        canActivate: [authGuardGuard]
    },
    {
        path:"appointment",
        component:AppointmentComponent,
        canActivate: [authGuardGuard]
    },

    {
        path:"prescription",
        component:PrescriptionComponent,
        canActivate: [authGuardGuard]
    },
    {
        path:"login",
        component:LoginComponent
    },
    {
        path:"doctor",
        component:DoctorsComponent
    },
    {
        path:"home",
        component:HomeComponent
    },
    {
        path:"book-appointment/:doctorId",
        component:BookingAppointmentComponent,
        canActivate: [authGuardGuard]
    },
    {
        path:"appointmentDetails",
        component:AppointmentDetailsComponent,
        canActivate: [authGuardGuard]
    },
    {
        path:"prescription",
        component:PrescriptionComponent,
        canActivate: [authGuardGuard]
    },
    {
        path:"viewTodaysApp",
        component:TodayAppDetailsComponent,
        canActivate: [authGuardGuard]
    },
    {
        path:"viewAllApp",
        component:ViewDoctorAppComponent,
        canActivate: [authGuardGuard]
    },
    {
        path:"addPres/:appointmentId",
        component:AddPrescriptionComponent,
        canActivate: [authGuardGuard]
    },
    {
        path:"view-prescription/:appointmentId",
        component:ViewPrescriptionComponent ,
        canActivate: [authGuardGuard]
    },
    {
        path:"doctor_home",
        component:DoctorHomeComponent,
        canActivate: [authGuardGuard]
    },
    {
        path:"patient-profile",
        component:PatientProfileComponent,
        canActivate: [authGuardGuard]
    }
];
