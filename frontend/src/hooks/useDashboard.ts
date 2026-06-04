import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';
import { QUERY_KEYS } from '@/api/queryKeys';

export function usePatientDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.patientDashboard,
    queryFn: dashboardService.getPatient,
  });
}

export function useDoctorDashboard() {
  return useQuery({
    queryKey: QUERY_KEYS.doctorDashboard,
    queryFn: dashboardService.getDoctor,
  });
}
