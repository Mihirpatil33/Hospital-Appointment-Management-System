import { useState } from 'react';
import { useMyPrescriptions } from '@/hooks/usePrescriptions';
import { SkeletonList } from '@/components/shared/SkeletonCard';
import { EmptyState, ErrorMessage } from '@/components/shared';
import type { Prescription } from '@/api/types';

function PrescriptionModal({ p, onClose }: { p: Prescription; onClose: () => void }) {
  const doctorName = typeof p.doctorId === 'object' ? (p.doctorId as any).fullName ?? 'Doctor' : 'Doctor';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-lg w-full max-h-[85vh] overflow-y-auto animate-fade-up">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-white font-semibold text-lg">Prescription Details</h2>
            <p className="text-slate-400 text-sm">{new Date(p.createdAt).toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">×</button>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Doctor</p>
            <p className="text-slate-200">{doctorName}</p>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Diagnosis</p>
            <p className="text-slate-200">{p.diagnosis}</p>
          </div>

          {p.treatmentPlan && (
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Treatment Plan</p>
              <p className="text-slate-200 text-sm">{p.treatmentPlan}</p>
            </div>
          )}

          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Medicines</p>
            <div className="space-y-2">
              {p.medicines.map((m, i) => (
                <div key={i} className="flex items-center gap-3 bg-brand-500/5 border border-brand-500/20 rounded-lg p-3">
                  <div className="w-2 h-2 bg-brand-500 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-white font-medium text-sm">{m.name}</span>
                    <span className="text-slate-400 text-sm"> · {m.dosage} · {m.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {p.notes && (
            <div className="bg-slate-800/50 rounded-lg p-3">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Notes</p>
              <p className="text-slate-200 text-sm">{p.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyPrescriptionsPage() {
  const { data: prescriptions, isLoading, isError } = useMyPrescriptions();
  const [selected, setSelected] = useState<Prescription | null>(null);

  if (isLoading) return <div className="max-w-2xl mx-auto px-4 py-8"><SkeletonList count={3} /></div>;
  if (isError) return <div className="p-8"><ErrorMessage message="Failed to load prescriptions." /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-up">
      <h1 className="font-display text-3xl text-white mb-2">My Prescriptions</h1>
      <p className="text-slate-400 mb-8">Your prescription history from all visits.</p>

      {!prescriptions?.length ? (
        <EmptyState message="No prescriptions yet." />
      ) : (
        <div className="space-y-4">
          {prescriptions.map(p => {
            const doctorName = typeof p.doctorId === 'object' ? (p.doctorId as any).fullName ?? 'Doctor' : 'Doctor';
            return (
              <div key={p._id} className="card hover:border-brand-500/40 transition-colors cursor-pointer group"
                onClick={() => setSelected(p)}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-semibold">{p.diagnosis}</p>
                    <p className="text-slate-400 text-sm mt-0.5">Dr. {doctorName}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-500">{p.medicines.length} medicine{p.medicines.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <span className="text-brand-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    View →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selected && <PrescriptionModal p={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
