export const QUERY_KEYS = {
  // Auth
  profile: ['profile'] as const,

  // Doctors
  doctors: ['doctors'] as const,
  doctorsSearch: (name: string, spec: string) => ['doctors', 'search', name, spec] as const,
  doctor: (id: string) => ['doctors', id] as const,

  // Appointments
  myAppointments: ['appointments', 'mine'] as const,
  doctorAppointments: ['appointments', 'doctor'] as const,

  // Prescriptions
  myPrescriptions: ['prescriptions', 'mine'] as const,
  prescription: (id: string) => ['prescriptions', id] as const,

  // Reviews
  doctorReviews: (doctorId: string) => ['reviews', 'doctor', doctorId] as const,

  // Payments
  paymentHistory: ['payments', 'history'] as const,

  // Dashboard
  patientDashboard: ['dashboard', 'patient'] as const,
  doctorDashboard: ['dashboard', 'doctor'] as const,
};
