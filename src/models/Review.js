import mongoose from "mongoose";

import Meal from "./Meal.js";

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

reviewSchema.post("save", async function () {
  await updateMealRating(this.meal);
});

reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await updateMealRating(doc.meal);
  }
});

const Review = mongoose.model("Review", reviewSchema);

const updateMealRating = async (mealId) => {
  const result = await Review.aggregate([
    { $match: { meal: new mongoose.Types.ObjectId(mealId) } },
    {
      $group: {
        _id: "$meal",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  await Meal.findByIdAndUpdate(mealId, {
    avgRating: result[0]?.avgRating ?? 0,
    totalReviews: result[0]?.totalReviews ?? 0,
  });
};

export default Review;
