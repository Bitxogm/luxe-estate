"use client";

import { useState, useTransition, useEffect } from "react";
import { Star, Trash2 } from "lucide-react";
import { createReviewAction, deleteReviewAction } from "@/server/actions/review.action";
import { notify } from "@/lib/toast";
import Image from "next/image";

export type ReviewWithUser = {
  id: string;
  rating: number;
  comment: string;
  createdAt: Date;
  userId: string;
  user: {
    name: string | null;
    image: string | null;
  };
};

interface ReviewSectionProps {
  propertyId: string;
  reviews: ReviewWithUser[];
  averageRating: number;
  currentUserId?: string;
  isOwner: boolean;
  isAdmin: boolean;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export default function ReviewSection({
  propertyId,
  reviews,
  averageRating,
  currentUserId,
  isOwner,
  isAdmin,
}: ReviewSectionProps) {
  const userReview = currentUserId ? reviews.find((r) => r.userId === currentUserId) : undefined;

  const [isEditing, setIsEditing] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Update form fields when userReview changes (e.g. after database upsert revalidation)
  useEffect(() => {
    if (userReview) {
      setRating(userReview.rating);
      setComment(userReview.comment);
    } else {
      setRating(5);
      setComment("");
    }
    setErrors({});
  }, [userReview]);

  const showForm = currentUserId && (!isOwner || isAdmin) && (!userReview || isEditing);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setComment(val);
    if (val.trim().length >= 10 && val.trim().length <= 500) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.comment;
        return copy;
      });
    } else {
      setErrors((prev) => ({
        ...prev,
        comment: "Comment must be between 10 and 500 characters.",
      }));
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const trimmedComment = comment.trim();
    if (trimmedComment.length < 10 || trimmedComment.length > 500) {
      setErrors({ comment: "Comment must be between 10 and 500 characters." });
      return;
    }

    startTransition(async () => {
      const result = await createReviewAction(propertyId, rating, trimmedComment);

      if (result.error) {
        setErrors({ root: result.error });
        notify.error(result.error);
      } else {
        notify.success("Review saved successfully!");
        setIsEditing(false);
      }
    });
  }

  async function handleDelete(reviewId: string) {
    if (!confirm("Are you sure you want to delete this review?")) return;

    setIsDeletingId(reviewId);
    const result = await deleteReviewAction(reviewId);
    setIsDeletingId(null);

    if (result.error) {
      notify.error(result.error);
    } else {
      notify.success("Review deleted.");
    }
  }

  return (
    <div className="mt-12 rounded-2xl border border-nordic/10 bg-white p-6 shadow-soft dark:border-white/10 dark:bg-nordic-muted/10 md:p-8">
      <div className="mb-8 flex items-center justify-between border-b border-nordic/10 pb-6 dark:border-white/10">
        <div>
          <h2 className="text-2xl font-bold text-nordic dark:text-clear-day">Reviews</h2>
          <p className="mt-1 text-sm text-nordic-muted dark:text-clear-day/60">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Star
            className="fill-mosque text-mosque dark:fill-hint-green dark:text-hint-green"
            size={28}
          />
          <span className="text-3xl font-bold text-nordic dark:text-clear-day">
            {averageRating.toFixed(1)}
          </span>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-10 rounded-xl bg-nordic/5 p-6 dark:bg-white/5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-nordic dark:text-clear-day">
            {userReview ? "Edit your review" : "Leave a review"}
          </h3>

          <div className="mb-4 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="transition-transform hover:scale-110"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={24}
                  className={`transition-colors ${
                    star <= (hoverRating || rating)
                      ? "fill-mosque text-mosque dark:fill-hint-green dark:text-hint-green"
                      : "fill-transparent text-nordic/20 dark:text-clear-day/20"
                  }`}
                />
              </button>
            ))}
          </div>

          <div className="mb-4">
            <textarea
              value={comment}
              onChange={handleCommentChange}
              placeholder="Share your thoughts about this property... (min 10 characters)"
              rows={4}
              className="w-full resize-none rounded-lg border border-nordic/10 bg-white px-4 py-3 text-sm text-nordic placeholder-nordic/30 outline-none transition-all focus:border-mosque focus:ring-1 focus:ring-mosque dark:border-white/10 dark:bg-nordic-muted/20 dark:text-clear-day dark:placeholder-clear-day/30 dark:focus:border-hint-green dark:focus:ring-hint-green"
              disabled={isPending}
            />
            {errors.comment && <p className="mt-1 text-xs text-red-500">{errors.comment}</p>}
            {errors.root && <p className="mt-1 text-xs text-red-500">{errors.root}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-lg bg-mosque px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-mosque/90 disabled:opacity-50 dark:bg-hint-green dark:text-nordic dark:hover:bg-hint-green/90"
            >
              {isPending ? "Saving..." : "Submit Review"}
            </button>
            {userReview && isEditing && (
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setRating(userReview.rating);
                  setComment(userReview.comment);
                  setErrors({});
                }}
                disabled={isPending}
                className="rounded-lg border border-nordic/20 px-6 py-2.5 text-sm font-medium text-nordic transition-colors hover:bg-nordic/5 disabled:opacity-50 dark:border-white/20 dark:text-clear-day dark:hover:bg-white/5"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {userReview && !isEditing && !showForm && (
        <div className="mb-10 rounded-xl border border-mosque/20 bg-mosque/5 p-6 dark:border-hint-green/20 dark:bg-hint-green/5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-mosque dark:text-hint-green">Your Review</h3>
            <button
              onClick={() => setIsEditing(true)}
              className="text-xs font-medium text-mosque hover:underline dark:text-hint-green"
            >
              Edit
            </button>
          </div>
          <div className="mb-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={
                  star <= userReview.rating
                    ? "fill-mosque text-mosque dark:fill-hint-green dark:text-hint-green"
                    : "fill-transparent text-nordic/20 dark:text-clear-day/20"
                }
              />
            ))}
          </div>
          <p className="text-sm text-nordic-muted dark:text-clear-day/70">{userReview.comment}</p>
        </div>
      )}

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="py-8 text-center text-sm text-nordic/40 dark:text-clear-day/40">
            No reviews yet. Be the first to review!
          </p>
        ) : (
          reviews.map((review) => {
            if (review.userId === currentUserId && !isEditing) return null; // Already displayed above

            const isAuthor = review.userId === currentUserId;
            const canDelete = isAuthor || isAdmin;
            const isDeleting = isDeletingId === review.id;

            return (
              <div
                key={review.id}
                className="flex gap-4 border-b border-nordic/5 pb-6 last:border-0 last:pb-0 dark:border-white/5"
              >
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-nordic/10 text-sm font-bold text-nordic dark:bg-white/10 dark:text-clear-day">
                  {review.user.image ? (
                    <Image
                      src={review.user.image}
                      alt="User avatar"
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    (review.user.name?.[0]?.toUpperCase() ?? "U")
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-nordic dark:text-clear-day">
                        {review.user.name ?? "Anonymous User"}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              className={
                                star <= review.rating
                                  ? "fill-mosque text-mosque dark:fill-hint-green dark:text-hint-green"
                                  : "fill-transparent text-nordic/20 dark:text-clear-day/20"
                              }
                            />
                          ))}
                        </div>
                        <span className="text-xs text-nordic/40 dark:text-clear-day/40">
                          {mounted ? timeAgo(new Date(review.createdAt)) : ""}
                        </span>
                      </div>
                    </div>
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(review.id)}
                        disabled={isDeleting}
                        className="text-nordic/30 transition-colors hover:text-red-500 disabled:opacity-50 dark:text-clear-day/30 dark:hover:text-red-400"
                        title="Delete review"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-nordic-muted dark:text-clear-day/70">
                    {review.comment}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
