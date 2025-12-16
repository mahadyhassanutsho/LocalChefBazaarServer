import express from "express";

import Review from "../models/Review.js";
import AppError from "../utils/AppError.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { limit, page, sort, order, ...filters } = req.query;

    const reviews = await Review.find(filters)
      .limit(Number(limit) || 0)
      .skip(((Number(page) || 1) - 1) * limit)
      .sort(sort ? { [sort]: order === "desc" ? -1 : 1 } : {})
      .populate("reviewer")
      .populate({ path: "meal", populate: { path: "chef" } });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("reviewer")
      .populate({ path: "meal", populate: { path: "chef" } });
    if (!review) return next(new AppError("Review not found", 404));
    res.json(review);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!review) return next(new AppError("Review not found", 404));
    res.json(review);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return next(new AppError("Review not found", 404));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;
