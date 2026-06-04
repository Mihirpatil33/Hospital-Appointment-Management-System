// ─── Auth ────────────────────────────────────────────────────────────────────
export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'PATIENT' | 'DOCTOR';
}

// ─── Doctor ───────────────────────────────────────────────────────────────────
export interface Doctor {
  _id: string;
  userId: { _id: string; fullName: string; email: string } | string;
  specialization: string;
  experience: number;
  qualification: string;
  consultationFee: number;
  about: string;
  bio?: string;
  isAvailable: boolean;
  availableTime?: string;
  availableDays?: string[];
}

// ─── Appointment ──────────────────────────────────────────────────────────────
export type AppointmentStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'RESCHEDULED';

export interface Appointment {
  _id: string;
  patientId: string | User;
  doctorId: string | Doctor;
  appointmentDate: string;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

// ─── Prescription ─────────────────────────────────────────────────────────────
export interface PrescriptionMedicine {
  name: string;
  dosage: string;
  duration: string;
}

export interface Prescription {
  _id: string;
  appointmentId: string | Appointment;
  patientId: string | User;
  doctorId: string | Doctor;
  diagnosis: string;
  medicines: PrescriptionMedicine[];
  treatmentPlan?: string;
  notes?: string;
  createdAt: string;
}

// ─── Review ───────────────────────────────────────────────────────────────────
export interface Review {
  _id: string;
  doctorId: string;
  patientId: string | User;
  rating: number;
  comment?: string;
  createdAt: string;
}

// ─── Payment ──────────────────────────────────────────────────────────────────
export interface Payment {
  _id: string;
  patientId: string | User;
  doctorId: string | Doctor;
  appointmentId: string | Appointment;
  amount: number;
  status: 'SUCCESS';
  createdAt: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export interface PatientDashboard {
  upcomingAppointments: Appointment[];
  totalAppointments: number;
  totalPrescriptions: number;
  totalPayments: number;
}

export interface DoctorDashboard {
  upcomingAppointments: Appointment[];
  totalAppointments: number;
  totalPatients: number;
  pendingCount: number;
  confirmedCount: number;
  completedCount: number;
  averageRating: number;
}
