import express from "express";

import stripe from "../config/stripe.js";
import { generateTrackingId } from "../utils/index.js";

import Order from "../models/Order.js";
import Meal from "../models/Meal.js";
import User from "../models/User.js";

import AppError from "../utils/AppError.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const query = req.query;
    const orders = await Order.find(query)
      .populate("user")
      .populate({
        path: "meal",
        populate: {
          path: "chef",
        },
      });
    res.json(orders);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user")
      .populate({
        path: "meal",
        populate: {
          path: "chef",
        },
      });
    if (!order) return next(new AppError("Order not found", 404));
    res.json(order);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { meal, user, quantity } = req.body;

    const existingMeal = await Meal.findById(meal);
    if (!existingMeal) return next(new AppError("Meal not found", 404));

    const existingUser = await User.findById(user);
    if (!existingUser) return next(new AppError("User not found", 404));

    const order = await Order.create({
      ...req.body,
      paymentAmount: existingMeal.price * quantity,
      unitPrice: existingMeal.price,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "BDT",
            unit_amount: order.unitPrice * 100,
            product_data: {
              name: existingMeal.name,
              images: [existingMeal.image],
              description: `Ordered from LocalChefBazaar`,
            },
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      metadata: {
        mealId: String(existingMeal._id),
      },
      customer_email: existingUser.email,
      success_url: `${process.env.SITE_DOMAIN}/order/payment-success?session={CHECKOUT_SESSION_ID}&order=${order._id}`,
      cancel_url: `${process.env.SITE_DOMAIN}/order/payment-cancelled`,
      payment_intent_data: {
        description: "Order from LocalChefBazaar",
      },
    });

    const updatedOrder = await Order.findByIdAndUpdate(
      order._id,
      {
        paymentUrl: session.url,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("user")
      .populate({
        path: "meal",
        populate: {
          path: "chef",
        },
      });

    res.status(201).json(updatedOrder);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.patch("/", async (req, res, next) => {
  try {
    const { session: sessionId, order: orderId } = req.body;

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid";
    const trackingId = generateTrackingId();

    const existingOrder = await Order.findById(orderId);
    if (!existingOrder) return next(new AppError("Order not found", 404));

    if (paid) {
      const order = await Order.findByIdAndUpdate(
        orderId,
        { status: "paid", transactionId: session.payment_intent, trackingId },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("user")
        .populate({ path: "meal", populate: { path: "chef" } });
      return res.json({ success: true, order });
    }

    res.json({ success: false, existingOrder });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return next(new AppError("Order not found", 404));
    res.status(204).send();
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;
