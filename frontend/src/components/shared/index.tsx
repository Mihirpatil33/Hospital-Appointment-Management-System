// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-brand-500 animate-spin" />
    </div>
  );
}

// ─── ErrorMessage ─────────────────────────────────────────────────────────────
export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-sm">
      {message}
    </div>
  );
}

// ─── StatusBadge ──────────────────────────────────────────────────────────────
const badgeMap: Record<string, string> = {
  PENDING:     'badge-pending',
  CONFIRMED:   'badge-confirmed',
  CANCELLED:   'badge-cancelled',
  COMPLETED:   'badge-confirmed',
  RESCHEDULED: 'badge-pending',
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={badgeMap[status] ?? 'badge-pending'}>
      {status}
    </span>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="card text-center py-12 text-slate-400">
      <p className="text-4xl mb-3">🗂️</p>
      <p>{message}</p>
    </div>
  );
}
