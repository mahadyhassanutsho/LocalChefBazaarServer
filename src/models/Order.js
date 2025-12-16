import mongoose from "mongoose";

const OrderStatus = {
  PENDING: "pending",
  PAID: "paid",
  CANCELLED: "cancelled",
  ON_DELIVERY: "on-delivery",
  DELIVERED: "delivered",
};

const orderSchema = mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
    },
    transactionId: {
      type: String,
    },
    trackingId: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    meal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal",
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
