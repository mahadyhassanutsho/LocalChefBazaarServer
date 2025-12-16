import express from "express";

import User from "../models/User.js";
import Meal from "../models/Meal.js";
import Order from "../models/Order.js";
import Review from "../models/Review.js";

const router = express.Router();

router.get("/stats", async (_req, res, next) => {
  try {
    const totalMeals = await Meal.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalReviews = await Review.countDocuments();

    const totalUsers = await User.countDocuments({ role: "user" });
    const totalChefs = await User.countDocuments({ role: "chef" });

    const paidOrders = await Order.countDocuments({ status: "paid" });
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const deliveredOrders = await Order.countDocuments({ status: "delivered" });
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

    const revenueAgg = await Order.aggregate([
      { $match: { status: "delivered" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$paymentAmount" },
        },
      },
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    const last7DaysOrders = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          orders: { $sum: 1 },
          revenue: { $sum: "$paymentAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalUsers,
      totalChefs,
      totalMeals,
      totalOrders,
      totalReviews,
      paidOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      ordersLast7Days: last7DaysOrders,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

export default router;
