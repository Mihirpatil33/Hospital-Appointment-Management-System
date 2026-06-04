import api from '@/api/axiosInstance';
import type { Review } from '@/api/types';

export interface CreateReviewDto {
  doctorId: string;
  rating: number;
  comment?: string;
}

export const reviewService = {
  create: (dto: CreateReviewDto) =>
    api.post<Review>('/reviews', dto).then(r => r.data),

  getByDoctor: (doctorId: string) =>
    api.get<Review[]>(`/reviews/doctor/${doctorId}`).then(r => r.data),
};
