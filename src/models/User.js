import mongoose from "mongoose";

export const UserStatus = {
  ACTIVE: "active",
  FRAUD: "fraud",
};

export const UserRole = {
  USER: "user",
  CHEF: "chef",
  ADMIN: "admin",
};

const userSchema = mongoose.Schema(
  {
    uid: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    photoURL: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(UserStatus),
      default: UserStatus.ACTIVE,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
