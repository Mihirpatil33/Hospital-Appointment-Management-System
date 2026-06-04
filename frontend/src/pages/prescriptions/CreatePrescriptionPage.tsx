import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useCreatePrescription } from '@/hooks/usePrescriptions';
import { useToast } from '@/context/ToastContext';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@/api/queryKeys';
import api from '@/api/axiosInstance';
import type { Appointment } from '@/api/types';

interface FormValues {
  appointmentId: string;
  patientId: string;
  diagnosis: string;
  treatmentPlan: string;
  notes: string;
  medicines: { name: string; dosage: string; duration: string }[];
}

export default function CreatePrescriptionPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { mutateAsync, isPending } = useCreatePrescription();

  const { data: appointments = [] } = useQuery({
    queryKey: QUERY_KEYS.doctorAppointments,
    queryFn: () => api.get<Appointment[]>('/appointments/doctor').then(r => r.data),
  });

  const confirmedAppts = appointments.filter(a => a.status === 'CONFIRMED');

  const { register, handleSubmit, watch, setValue, control, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      medicines: [{ name: '', dosage: '', duration: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'medicines' });

  const selectedApptId = watch('appointmentId');

  // Auto-fill patientId when appointment selected
  const handleApptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const appt = confirmedAppts.find(a => a._id === e.target.value);
    if (appt) {
      const patientId = typeof appt.patientId === 'object' ? appt.patientId._id : appt.patientId;
      setValue('patientId', patientId);
      setValue('appointmentId', appt._id);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await mutateAsync(data);
      showToast('Prescription created successfully');
      navigate('/doctor/appointments');
    } catch {
      showToast('Failed to create prescription', 'error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-up">
      <h1 className="font-display text-3xl text-white mb-2">Create Prescription</h1>
      <p className="text-slate-400 mb-8">Fill in the prescription details for the patient.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Appointment Selector */}
        <div className="card space-y-4">
          <h2 className="text-brand-400 font-semibold text-sm uppercase tracking-wider">Appointment</h2>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Select Confirmed Appointment *</label>
            <select
              className="input-base w-full"
              onChange={handleApptChange}
              defaultValue=""
            >
              <option value="" disabled>Choose appointment…</option>
              {confirmedAppts.map(a => {
                const patientName = typeof a.patientId === 'object' ? a.patientId.fullName : a.patientId;
                return (
                  <option key={a._id} value={a._id}>
                    {patientName} — {new Date(a.date).toLocaleDateString()} — {a.reason}
                  </option>
                );
              })}
            </select>
            {confirmedAppts.length === 0 && (
              <p className="text-slate-500 text-xs mt-1">No confirmed appointments available.</p>
            )}
            <input type="hidden" {...register('appointmentId', { required: true })} />
            <input type="hidden" {...register('patientId', { required: true })} />
          </div>
        </div>

        {/* Diagnosis & Treatment */}
        <div className="card space-y-4">
          <h2 className="text-brand-400 font-semibold text-sm uppercase tracking-wider">Clinical Details</h2>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Diagnosis *</label>
            <input
              className="input-base w-full"
              placeholder="e.g. Hypertension Stage 1"
              {...register('diagnosis', { required: 'Diagnosis is required' })}
            />
            {errors.diagnosis && <p className="text-red-400 text-xs mt-1">{errors.diagnosis.message}</p>}
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Treatment Plan</label>
            <textarea
              className="input-base w-full h-24 resize-none"
              placeholder="Recommended treatment plan…"
              {...register('treatmentPlan')}
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">Additional Notes</label>
            <textarea
              className="input-base w-full h-20 resize-none"
              placeholder="Any additional instructions…"
              {...register('notes')}
            />
          </div>
        </div>

        {/* Medicines */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-brand-400 font-semibold text-sm uppercase tracking-wider">Medicines</h2>
            <button
              type="button"
              onClick={() => append({ name: '', dosage: '', duration: '' })}
              className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors"
            >
              + Add Medicine
            </button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-3 gap-3 items-start">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Name *</label>
                <input
                  className="input-base w-full text-sm"
                  placeholder="Medicine name"
                  {...register(`medicines.${index}.name`, { required: true })}
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Dosage *</label>
                <input
                  className="input-base w-full text-sm"
                  placeholder="e.g. 500mg"
                  {...register(`medicines.${index}.dosage`, { required: true })}
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 mb-1">Duration *</label>
                  <input
                    className="input-base w-full text-sm"
                    placeholder="e.g. 7 days"
                    {...register(`medicines.${index}.duration`, { required: true })}
                  />
                </div>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-5 text-red-400 hover:text-red-300 text-lg leading-none"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={isPending || !selectedApptId} className="btn-primary flex-1">
            {isPending ? 'Creating…' : 'Create Prescription'}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
