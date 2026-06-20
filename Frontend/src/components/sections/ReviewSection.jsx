import React, { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

export default function ReviewSection() {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "Azizbek",
      comment: "Ajoyib xizmat! Ehtiyot qismlar sifatli va o'z vaqtida yetkazib berildi.",
      rating: 5,
      date: "2024-05-12",
    },
    {
      id: 2,
      name: "Dilshod",
      comment:
        "Yetkazib berish juda tez. Rahmat! Keyingi safar ham albatta shu yerdan xarid qilaman.",
      rating: 4,
      date: "2024-05-10",
    },
  ]);

  const [newName, setNewName] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const { t } = useLanguage();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newComment.trim()) return;

    const newReview = {
      id: Date.now(),
      name: newName,
      comment: newComment,
      rating: newRating,
      date: new Date().toISOString().split("T")[0],
    };

    setReviews([newReview, ...reviews]);
    setNewName("");
    setNewComment("");
    setNewRating(5);
  };

  return (
    <section id="reviews" className="py-16 bg-slate-900/50 font-body border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-slate-50 sm:text-4xl">{t("reviewTitle")}</h2>
          <p className="mt-4 text-slate-400">{t("reviewDesc")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div
                  key={review.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-200">{review.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{review.date}</p>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < review.rating ? "fill-current" : "text-slate-700"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 rounded-xl border border-slate-800 bg-slate-900/80">
                <MessageSquare className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400">
                  Hozircha fikrlar yo'q. Birinchi bo'lib fikr qoldiring!
                </p>
              </div>
            )}
          </div>

          {/* Review Form */}
          <div className="lg:col-span-5 sticky top-24 rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-50 mb-6">Fikr qoldirish</h3>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Ismingiz</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-slate-50 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors"
                  placeholder="Ismingizni kiriting"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Baholash</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="text-yellow-400 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`h-7 w-7 ${star <= newRating ? "fill-current" : "text-slate-700 hover:text-yellow-400/50"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {t("reviewLabelComment")}
                </label>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-slate-50 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 h-32 resize-none transition-colors"
                  placeholder={t("reviewPlaceholderComment")}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-cyan-500 px-4 py-3 font-semibold text-slate-950 transition-all hover:bg-cyan-400 active:scale-[0.98]"
              >
                {t("reviewBtnSubmit")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
