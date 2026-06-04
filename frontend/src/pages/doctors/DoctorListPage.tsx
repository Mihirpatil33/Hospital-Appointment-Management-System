import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { QUERY_KEYS } from '@/api/queryKeys';
import api from '@/api/axiosInstance';
import { Spinner, EmptyState } from '@/components/shared';
import { useDebounce } from '@/hooks/useDebounce';
import type { Doctor } from '@/api/types';

export default function DoctorListPage() {
  const [name, setName] = useState('');
  const [spec, setSpec] = useState('');
  const dName = useDebounce(name, 400);
  const dSpec = useDebounce(spec, 400);

  const isSearching = dName.trim() || dSpec.trim();

  const { data: doctors, isLoading } = useQuery({
    queryKey: isSearching ? QUERY_KEYS.doctorsSearch(dName, dSpec) : QUERY_KEYS.doctors,
    queryFn: () => isSearching
      ? api.get<Doctor[]>('/doctors/search', { params: { name: dName, specialization: dSpec } }).then(r => r.data)
      : api.get<Doctor[]>('/doctors').then(r => r.data),
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-up">
      <h1 className="font-display text-3xl text-white mb-6">Find a Doctor</h1>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <input className="input-base" placeholder="Search by name…"
          value={name} onChange={e => setName(e.target.value)} />
        <input className="input-base" placeholder="Specialization…"
          value={spec} onChange={e => setSpec(e.target.value)} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : !doctors?.length ? (
        <EmptyState message="No doctors found." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {doctors.map(d => {
            const doctorName = (d as any).userId?.fullName ?? 'Doctor';
            return (
              <Link key={d._id} to={`/doctors/${d._id}`} className="card hover:border-brand-500/40 transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-brand-400 text-lg font-display">{doctorName.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">Dr. {doctorName}</p>
                    {d.specialization && <p className="text-brand-400 text-sm">{d.specialization}</p>}
                    {d.experience !== undefined && d.experience > 0 && (
                      <p className="text-slate-500 text-xs mt-1">{d.experience} yrs experience</p>
                    )}
                    {d.consultationFee !== undefined && (
                      <p className="text-slate-400 text-xs mt-1">₹{d.consultationFee} fee</p>
                    )}
                  </div>
                  <span className="text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}