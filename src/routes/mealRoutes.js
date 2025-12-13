import express from "express";

import Meal from "../models/Meal.js";
import AppError from "../utils/AppError.js";
import { getMealRating } from "../models/Review.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { limit, page, sort, order, ...filters } = req.query;

    const meals = await Meal.find(filters)
      .limit(Number(limit) || 0)
      .skip(((Number(page) || 1) - 1) * limit)
      .sort(sort ? { [sort]: order === "desc" ? -1 : 1 } : {})
      .populate("chef");

    const mealsWithRatings = await Promise.all(
      meals.map(async (meal) => {
        const { avgRating, totalReviews } = await getMealRating(meal._id);
        return {
          ...meal.toObject(),
          avgRating,
          totalReviews,
        };
      })
    );

    console.log(mealsWithRatings);

    res.json(mealsWithRatings);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const meal = await Meal.findById(req.params.id).populate("chef");
    if (!meal) return next(new AppError("Meal not found", 404));
    const { avgRating, totalReviews } = await getMealRating(meal._id);
    res.json({ ...meal.toObject(), avgRating, totalReviews });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const meal = await Meal.create(req.body);
    res.status(201).json(meal);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const meal = await Meal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!meal) return next(new AppError("Meal not found", 404));
    res.json(meal);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const meal = await Meal.findByIdAndDelete(req.params.id);
    if (!meal) return next(new AppError("Meal not found", 404));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;
