import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService, CreatePaymentDto } from '@/services/paymentService';
import { QUERY_KEYS } from '@/api/queryKeys';

export function usePaymentHistory() {
  return useQuery({
    queryKey: QUERY_KEYS.paymentHistory,
    queryFn: paymentService.getHistory,
  });
}

export function usePay() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreatePaymentDto) => paymentService.pay(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.paymentHistory });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.patientDashboard });
    },
  });
}
