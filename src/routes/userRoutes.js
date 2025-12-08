import express from "express";

import admin from "../config/firebase.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const query = req.query;
    const users = await User.find(query);
    res.json(users);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return next(new AppError("User not found", 404));
    res.json(user);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) return next(new AppError("User not found", 404));
    res.json(user);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new AppError("User not found", 404));
    await admin.auth().deleteUser(user.uid);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;
