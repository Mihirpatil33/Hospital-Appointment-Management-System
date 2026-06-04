import api from '@/api/axiosInstance';
import type { PatientDashboard, DoctorDashboard } from '@/api/types';

export const dashboardService = {
  getPatient: () =>
    api.get<PatientDashboard>('/dashboard/patient').then(r => r.data),

  getDoctor: () =>
    api.get<DoctorDashboard>('/dashboard/doctor').then(r => r.data),
};
