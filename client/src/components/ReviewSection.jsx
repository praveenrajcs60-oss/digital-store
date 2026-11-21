import React, { useState } from 'react';
import { Star, ShieldCheck, MessageSquarePlus, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Link } from 'react-router-dom';

export default function ReviewSection({ productId, initialReviews = [], onReviewAdded }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const data = await api.addReview({
        productId,
        rating,
        comment: comment.trim()
      });
      setReviews([data.review, ...reviews]);
      setComment('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
      if (onReviewAdded) onReviewAdded();
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '5.0';

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900/60 rounded-2xl border border-slate-800">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Customer Reviews</span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-mono">
              {reviews.length}
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Verified ratings from developers and product builders who purchased this asset.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700/60">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= Math.round(Number(avgRating))
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-600'
                }`}
              />
            ))}
          </div>
          <span className="text-lg font-extrabold text-white">{avgRating}</span>
          <span className="text-xs text-slate-400">/ 5.0</span>
        </div>
      </div>

      {/* Write a review form */}
      <div className="p-6 bg-slate-900/40 rounded-2xl border border-slate-800/80">
        <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <MessageSquarePlus className="w-4 h-4 text-blue-400" />
          <span>Leave a Review</span>
        </h4>

        {user ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Your Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600 hover:text-slate-500'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-slate-300 ml-2">
                  {hoverRating || rating} Stars
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">
                Review Feedback
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this codebase, documentation, or template..."
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-rose-400">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="text-xs text-emerald-400">
                Thank you! Your review has been submitted.
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-600/20"
            >
              {submitting ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        ) : (
          <div className="p-4 bg-slate-800/50 rounded-xl text-center text-xs text-slate-400">
            Please{' '}
            <Link to="/login" className="text-blue-400 font-semibold hover:underline">
              Sign In
            </Link>{' '}
            to rate and review this digital product.
          </div>
        )}
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            No reviews yet. Be the first customer to review this asset!
          </p>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100">{rev.userName}</span>
                    {rev.verifiedPurchase && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  {rev.userRole && !rev.verifiedPurchase && (
                    <span className="text-[11px] text-slate-500">{rev.userRole}</span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>

              <div className="text-[10px] text-slate-500">
                {new Date(rev.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
