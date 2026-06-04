import api from '@/api/axiosInstance';
import type { Payment } from '@/api/types';

export interface CreatePaymentDto {
  appointmentId: string;
  doctorId: string;
  amount: number;
}

export const paymentService = {
  pay: (dto: CreatePaymentDto) =>
    api.post<Payment>('/payments/pay', dto).then(r => r.data),

  getHistory: () =>
    api.get<Payment[]>('/payments/history').then(r => r.data),
};
