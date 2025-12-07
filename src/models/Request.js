import mongoose from "mongoose";

export const RequestRole = {
  ADMIN: "admin",
  CHEF: "chef",
};

export const RequestStatus = {
  APPROVED: "approved",
  PENDING: "pending",
};

const requestSchema = mongoose.Schema(
  {
    role: {
      type: String,
      enum: Object.values(RequestRole),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(RequestStatus),
      default: RequestStatus.PENDING,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Request = mongoose.model("Request", requestSchema);

export default Request;
