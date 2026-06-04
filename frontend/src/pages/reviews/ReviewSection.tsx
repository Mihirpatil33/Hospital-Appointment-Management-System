import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDoctorReviews, useCreateReview } from '@/hooks/useReviews';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useThrottle } from '@/hooks/useThrottle';
import type { Review } from '@/api/types';

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type={onChange ? 'button' : 'button'}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={`text-2xl transition-colors ${onChange ? 'cursor-pointer' : 'cursor-default'} 
            ${star <= (hovered || value) ? 'text-yellow-400' : 'text-slate-600'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const patientName = typeof review.patientId === 'object'
    ? (review.patientId as any).fullName ?? 'Anonymous'
    : 'Anonymous';

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-white font-medium text-sm">{patientName}</p>
          <p className="text-slate-500 text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
        <StarRating value={review.rating} />
      </div>
      {review.comment && <p className="text-slate-300 text-sm mt-2">{review.comment}</p>}
    </div>
  );
}

interface ReviewFormValues {
  rating: number;
  comment: string;
}

export default function ReviewSection({ doctorId }: { doctorId: string }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isPatient = user?.role === 'PATIENT';

  const { data: reviews = [], isLoading } = useDoctorReviews(doctorId);
  const { mutateAsync, isPending } = useCreateReview(doctorId);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ReviewFormValues>({
    defaultValues: { rating: 0, comment: '' },
  });

  const rating = watch('rating');
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  const submitReview = async (data: ReviewFormValues) => {
    if (!data.rating) return showToast('Please select a star rating', 'error');
    try {
      await mutateAsync({ doctorId, ...data });
      showToast('Review submitted!');
      reset();
    } catch {
      showToast('Failed to submit review. You may have already reviewed this doctor.', 'error');
    }
  };

  // Throttle submit to prevent rapid re-submission
  const throttledSubmit = useThrottle(handleSubmit(submitReview), 3000);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="font-display text-2xl text-white">Patient Reviews</h2>
        {avgRating && (
          <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-full px-3 py-1">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-yellow-300 font-semibold text-sm">{avgRating}</span>
            <span className="text-slate-400 text-xs">({reviews.length})</span>
          </div>
        )}
      </div>

      {/* Submit Form — PATIENT only */}
      {isPatient && (
        <div className="card mb-6">
          <h3 className="text-white font-medium mb-4">Leave a Review</h3>
          <form onSubmit={e => { e.preventDefault(); throttledSubmit(); }} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Rating *</label>
              <StarRating value={rating} onChange={v => setValue('rating', v)} />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">Comment</label>
              <textarea
                className="input-base w-full h-20 resize-none"
                placeholder="Share your experience…"
                {...register('comment')}
              />
            </div>
            <button type="submit" disabled={isPending} className="btn-primary w-full">
              {isPending ? 'Submitting…' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}

      {/* Review List */}
      {isLoading ? (
        <p className="text-slate-400 text-sm">Loading reviews…</p>
      ) : reviews.length === 0 ? (
        <p className="text-slate-500 text-sm">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-3">
          {reviews.map(r => <ReviewCard key={r._id} review={r} />)}
        </div>
      )}
    </div>
  );
}
