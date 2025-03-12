// src/app/models/user-info.ts
export interface UserInfo {
  id: number;
  name: string;
  email: string;
  password: string;
  roles: string;
}

export interface PatientInfo {
  patientID: number;
  emailID: string;
  patientName: string;
  patientAge: number;
  mobile_number: string;
  gender:String;
}

export interface DoctorInfo{

   doctorId:number;
	   emailId:string;
	   name:string;
	   mobile_number:string;
	   specialization:string;
     gender:string;
}