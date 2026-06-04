import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prescriptionService, CreatePrescriptionDto } from '@/services/prescriptionService';
import { QUERY_KEYS } from '@/api/queryKeys';

export function useMyPrescriptions() {
  return useQuery({
    queryKey: QUERY_KEYS.myPrescriptions,
    queryFn: prescriptionService.getMyPrescriptions,
  });
}

export function usePrescription(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.prescription(id),
    queryFn: () => prescriptionService.getById(id),
    enabled: !!id,
  });
}

export function useCreatePrescription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreatePrescriptionDto) => prescriptionService.create(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.myPrescriptions });
    },
  });
}
