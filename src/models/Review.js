import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
      min: [0, "Rating cannot be less than 0"],
      max: [5, "Rating cannot be more than 5"],
    },
    comment: { type: String, required: true },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal",
      required: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export async function getMealRating(mealId) {
  const result = await Review.aggregate([
    {
      $match: {
        meal: new mongoose.Types.ObjectId(mealId),
        rating: { $type: "number" },
      },
    },
    {
      $group: {
        _id: null,
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  return {
    avgRating: result[0]?.avgRating ?? 0,
    totalReviews: result[0]?.totalReviews ?? 0,
  };
}

export default Review;
