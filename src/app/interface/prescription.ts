import { Medicine } from "./medicine";

export interface Prescription {
    aid: number;
    patientid: number;
    doctorid: number;
    medicine: Medicine[];
    date: string; // If you want to handle dates, consider using Date type
    doctor_name: string;
    patient_name:string;
  }