import api from '@/api/axiosInstance';
import type { Prescription, PrescriptionMedicine } from '@/api/types';

export interface CreatePrescriptionDto {
  appointmentId: string;
  patientId: string;
  diagnosis: string;
  medicines: PrescriptionMedicine[];
  treatmentPlan?: string;
  notes?: string;
}

export const prescriptionService = {
  create: (dto: CreatePrescriptionDto) =>
    api.post<Prescription>('/prescriptions', dto).then(r => r.data),

  getMyPrescriptions: () =>
    api.get<Prescription[]>('/prescriptions/patient').then(r => r.data),

  getById: (id: string) =>
    api.get<Prescription>(`/prescriptions/${id}`).then(r => r.data),
};
