import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/api/queryKeys';
import api from '@/api/axiosInstance';
import { Spinner, ErrorMessage } from '@/components/shared';
import ReviewSection from '@/pages/reviews/ReviewSection';
import { useAuth } from '@/context/AuthContext';
import type { Doctor } from '@/api/types';

export default function DoctorDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const { data: doctor, isLoading, isError } = useQuery({
    queryKey: QUERY_KEYS.doctor(id!),
    queryFn: () => api.get<Doctor>(`/doctors/${id}`).then(r => r.data),
    enabled: !!id,
  });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;
  if (isError || !doctor) return <div className="p-8"><ErrorMessage message="Doctor not found." /></div>;

  const name = (typeof doctor.userId === 'object' ? (doctor.userId as any).fullName : null) ?? 'Doctor';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-up">
      <div className="card mb-6">
        <div className="flex items-start gap-5">
          <div className="w-16 h-16 bg-brand-500/15 rounded-2xl flex items-center justify-center flex-shrink-0">
            <span className="text-brand-400 text-2xl font-display">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="font-display text-2xl text-white">Dr. {name}</h1>
            {doctor.specialization && (
              <p className="text-brand-400 text-sm mt-0.5">{doctor.specialization}</p>
            )}
            {doctor.experience !== undefined && doctor.experience > 0 && (
              <p className="text-slate-400 text-sm mt-1">{doctor.experience} years experience</p>
            )}
          </div>
        </div>

        {doctor.bio && (
          <p className="text-slate-300 text-sm mt-4 leading-relaxed border-t border-slate-700/50 pt-4">
            {doctor.bio}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 mt-4">
          {doctor.consultationFee !== undefined && (
            <div className="bg-slate-800/50 rounded-xl p-3">
              <p className="text-slate-500 text-xs">Consultation Fee</p>
              <p className="text-white font-semibold mt-0.5">₹{doctor.consultationFee}</p>
            </div>
          )}
          {doctor.availableTime && (
            <div className="bg-slate-800/50 rounded-xl p-3">
              <p className="text-slate-500 text-xs">Available Time</p>
              <p className="text-white font-semibold mt-0.5">{doctor.availableTime}</p>
            </div>
          )}
        </div>

        {doctor.availableDays && doctor.availableDays.length > 0 && (
          <div className="mt-3">
            <p className="text-slate-500 text-xs mb-2">Available Days</p>
            <div className="flex flex-wrap gap-2">
              {doctor.availableDays.map(d => (
                <span key={d} className="badge-confirmed text-xs">{d}</span>
              ))}
            </div>
          </div>
        )}

        {user?.role === 'PATIENT' && (
          <Link to={`/book/${doctor._id}`} className="btn-primary w-full mt-5 text-center block">
            Book Appointment
          </Link>
        )}
      </div>

      <ReviewSection doctorId={doctor._id} />
    </div>
  );
}