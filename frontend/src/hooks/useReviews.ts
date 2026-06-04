import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService, CreateReviewDto } from '@/services/reviewService';
import { QUERY_KEYS } from '@/api/queryKeys';

export function useDoctorReviews(doctorId: string) {
  return useQuery({
    queryKey: QUERY_KEYS.doctorReviews(doctorId),
    queryFn: () => reviewService.getByDoctor(doctorId),
    enabled: !!doctorId,
  });
}

export function useCreateReview(doctorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateReviewDto) => reviewService.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.doctorReviews(doctorId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.doctor(doctorId) });
    },
  });
}
