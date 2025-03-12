export interface PatientDto {
  patientID: number;
  patientName: string;
  emailID: string;
  patientAge: number;
  mobile_number: string;
  gender: string;
  // Add other patient fields as necessary
}

export interface DoctorDto {
  doctorId: number;
  name: string;
  emailId: string;
  mobile_number: string;
  specialization: string;
  // Add other doctor fields as necessary
}

export interface PatientDoctorAppointmentDto {
  patient: PatientDto;
  doctor: DoctorDto;
  appId: number;
  date: string;
  time: string;
  status: string;
}