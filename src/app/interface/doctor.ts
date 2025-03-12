export interface Doctor {
    doctorId: number;
    name: string;
    emailId: string;
    specialization: string;
    mobile_number: string;
    gender: 'Male' | 'Female';
  }

  export interface FilteredDoctor {
    doctorId: number;
    name: string;
    emailId: string;
    specialization: string;
    mobile_number: string;
    gender: 'Male' | 'Female';
  }
  