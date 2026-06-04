export function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div className="card animate-pulse">
      <div className="h-5 bg-slate-700 rounded w-2/5 mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`h-3 bg-slate-700 rounded mb-3 ${i === rows - 1 ? 'w-3/5' : 'w-full'}`} />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}
