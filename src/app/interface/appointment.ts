export interface Appointment {
    appointmentId: number | null;
    patientId: number | null;
    doctorId: number | null;
    date: string | null;
    time: string | null;
    status: string;
  }
  