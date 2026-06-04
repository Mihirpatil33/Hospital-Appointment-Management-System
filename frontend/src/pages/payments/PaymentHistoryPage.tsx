import { usePaymentHistory } from '@/hooks/usePayments';
import { SkeletonList } from '@/components/shared/SkeletonCard';
import { EmptyState, ErrorMessage } from '@/components/shared';

export default function PaymentHistoryPage() {
  const { data: payments, isLoading, isError } = usePaymentHistory();

  if (isLoading) return <div className="max-w-2xl mx-auto px-4 py-8"><SkeletonList count={4} /></div>;
  if (isError) return <div className="p-8"><ErrorMessage message="Failed to load payment history." /></div>;

  const total = payments?.reduce((s, p) => s + p.amount, 0) ?? 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-up">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-white mb-1">Payment History</h1>
          <p className="text-slate-400">All your past payments.</p>
        </div>
        {!!payments?.length && (
          <div className="text-right">
            <p className="text-slate-500 text-xs uppercase tracking-wider">Total Spent</p>
            <p className="text-brand-400 font-semibold text-xl">₹{total}</p>
          </div>
        )}
      </div>

      {!payments?.length ? (
        <EmptyState message="No payment history yet." />
      ) : (
        <div className="space-y-3">
          {payments.map(p => {
            const doctorName = typeof p.doctorId === 'object'
              ? (p.doctorId as any).fullName ?? 'Doctor'
              : 'Doctor';

            return (
              <div key={p._id} className="card flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Dr. {doctorName}</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {new Date(p.createdAt).toLocaleDateString()} ·{' '}
                    {new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge-confirmed text-xs">SUCCESS</span>
                  <span className="text-white font-semibold">₹{p.amount}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
