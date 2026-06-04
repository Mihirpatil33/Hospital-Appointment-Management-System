import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePay } from '@/hooks/usePayments';
import { useToast } from '@/context/ToastContext';
import { useThrottle } from '@/hooks/useThrottle';
import { QUERY_KEYS } from '@/api/queryKeys';
import api from '@/api/axiosInstance';
import { SkeletonList } from '@/components/shared/SkeletonCard';
import { EmptyState } from '@/components/shared';
import type { Appointment, Payment } from '@/api/types';

function SuccessModal({ payment, onClose }: { payment: Payment; onClose: () => void }) {
  const doctorName = typeof payment.doctorId === 'object'
    ? (payment.doctorId as any).fullName ?? 'Doctor'
    : 'Doctor';

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-sm w-full text-center animate-fade-up">
        <div className="w-16 h-16 bg-brand-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-brand-400 text-3xl">✓</span>
        </div>
        <h2 className="text-white font-display text-2xl mb-1">Payment Successful!</h2>
        <p className="text-slate-400 text-sm mb-6">Your payment has been processed.</p>

        <div className="bg-slate-800/60 rounded-xl p-4 text-left space-y-2 mb-6">
          <div className="flex justify-between">
            <span className="text-slate-400 text-sm">Doctor</span>
            <span className="text-white text-sm">Dr. {doctorName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 text-sm">Amount</span>
            <span className="text-brand-400 font-semibold">₹{payment.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 text-sm">Status</span>
            <span className="badge-confirmed">SUCCESS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 text-sm">Date</span>
            <span className="text-white text-sm">{new Date(payment.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <button onClick={onClose} className="btn-primary w-full">Done</button>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  const { showToast } = useToast();
  const { mutateAsync, isPending } = usePay();
  const [successPayment, setSuccessPayment] = useState<Payment | null>(null);

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.myAppointments,
    queryFn: () => api.get<Appointment[]>('/appointments/my-appointments').then(r => r.data),
  });

  const unpaidAppointments = appointments.filter(
    a => a.status === 'CONFIRMED' || a.status === 'COMPLETED'
  );

  const handlePay = useThrottle(async (appt: Appointment) => {
    const doctorId = typeof appt.doctorId === 'object' ? appt.doctorId._id : appt.doctorId;
    const fee = typeof appt.doctorId === 'object' ? (appt.doctorId as any).consultationFee ?? 500 : 500;

    try {
      const payment = await mutateAsync({
        appointmentId: appt._id,
        doctorId,
        amount: fee,
      });
      setSuccessPayment(payment);
    } catch {
      showToast('Payment failed. Please try again.', 'error');
    }
  }, 3000);

  if (isLoading) return <div className="max-w-2xl mx-auto px-4 py-8"><SkeletonList count={3} /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-up">
      <h1 className="font-display text-3xl text-white mb-2">Make a Payment</h1>
      <p className="text-slate-400 mb-8">Pay for your confirmed appointments (demo — no real charge).</p>

      {unpaidAppointments.length === 0 ? (
        <EmptyState message="No appointments eligible for payment." />
      ) : (
        <div className="space-y-4">
          {unpaidAppointments.map(appt => {
            const doctorName = typeof appt.doctorId === 'object'
              ? (appt.doctorId as any).fullName ?? 'Doctor'
              : 'Doctor';
            const specialization = typeof appt.doctorId === 'object'
              ? (appt.doctorId as any).specialization
              : null;
            const fee = typeof appt.doctorId === 'object'
              ? (appt.doctorId as any).consultationFee ?? 500
              : 500;

            return (
              <div key={appt._id} className="card">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-semibold">Dr. {doctorName}</p>
                    {specialization && <p className="text-slate-400 text-sm">{specialization}</p>}
                    <p className="text-slate-500 text-xs mt-1">
                      {new Date(appt.date).toLocaleDateString()} · {appt.reason}
                    </p>
                    <p className="text-brand-400 font-semibold mt-2">₹{fee}</p>
                  </div>
                  <button
                    onClick={() => handlePay(appt)}
                    disabled={isPending}
                    className="btn-primary text-sm py-2 px-4"
                  >
                    {isPending ? 'Processing…' : 'Pay Now'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {successPayment && (
        <SuccessModal payment={successPayment} onClose={() => setSuccessPayment(null)} />
      )}
    </div>
  );
}
