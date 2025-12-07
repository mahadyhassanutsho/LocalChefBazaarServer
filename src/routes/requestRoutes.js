import express from "express";

import Request from "../models/Request.js";
import AppError from "../utils/AppError.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const query = req.query;
    const requests = await Request.find(query);
    res.json(requests);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return next(new AppError("Request not found", 404));
    res.json(request);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { user, role } = req.body;
    const existingRequest = await Request.findOne({ user, role });
    if (existingRequest) {
      res.status(200).json(existingRequest);
    } else {
      const request = await Request.create({ user, role });
      res.status(201).json(request);
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    const request = await Request.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!request) return next(new AppError("Request not found", 404));
    res.json(request);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) return next(new AppError("Request not found", 404));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;
