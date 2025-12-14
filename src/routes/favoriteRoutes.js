import express from "express";

import Favorite from "../models/Favorite.js";
import AppError from "../utils/AppError.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const query = req.query;
    const favorites = await Favorite.find(query)
      .populate("user")
      .populate({
        path: "meal",
        populate: {
          path: "chef",
        },
      });
    res.json(favorites);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const favorite = await Favorite.findById(req.params.id)
      .populate("user")
      .populate({
        path: "meal",
        populate: {
          path: "chef",
        },
      });
    if (!favorite) return next(new AppError("Favorite not found", 404));
    res.json(favorite);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { user, meal } = req.body;
    const existingFavorite = await Favorite.findOne({ user, meal });
    if (existingFavorite) {
      res.status(200).json(existingFavorite);
    } else {
      const favorite = await Favorite.create(req.body);
      res.status(201).json(favorite);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const favorite = await Favorite.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!favorite) return next(new AppError("Favorite not found", 404));
    res.json(favorite);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const favorite = await Favorite.findByIdAndDelete(req.params.id);
    if (!favorite) return next(new AppError("Favorite not found", 404));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;
