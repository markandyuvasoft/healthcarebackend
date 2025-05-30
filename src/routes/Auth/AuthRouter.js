import express from "express";
import {
  bookAppointment,
  cancelDoctorAppointment,
  foundAppointment,
  getAuthDetails,
  getDoctorReviews,
  loginAuth,
  registerAuth,
  reset_password,
  submitReview,
  updateAuth,
  verifyEmail,
  verifyOtp,
} from "../../controller/Auth/AuthController.js";

import { Token } from "../../../middleware/checkAuth.js";
import { authorized } from "../../../middleware/role.js";
import { upload } from "../../../middleware/image.js";
import { getAllDoctors } from "../../controller/Doctors/DoctorController.js";

const userRouter = express.Router();

// FOR AUTH DETAILS.....................................
userRouter.post("/register", registerAuth);
userRouter.post("/login", loginAuth);
userRouter.post("/verify-email", verifyEmail);
userRouter.post("/verify-otp", verifyOtp);
userRouter.post("/reset-password", reset_password);

userRouter.get(
  "/found-auth-details",
  Token,
  authorized("Patient", "Doctor"),
  getAuthDetails
);

userRouter.put(
  "/update-details",
  upload.single("profileImage"),
  Token,
  authorized("Patient", "Doctor"),
  updateAuth
);

// FOR DOCTOR DETAILS.............................
userRouter.get(
  "/foundAllDoctors",
  Token,
  authorized("Patient", "Admin"),
  getAllDoctors
);

// FOR BOOKING WORK...................................

userRouter.post(
  "/doctor-booking/:doctorId",
  Token,
  authorized("Patient", "Admin"),
  bookAppointment
);

userRouter.get(
  "/found-appointment",
  Token,
  authorized("Patient", "Admin"),
  foundAppointment
);

userRouter.put(
  "/cancel-appointment/:doctorId",
  Token,
  authorized("Patient", "Doctor"),
  cancelDoctorAppointment
);

// FOR RATING REVIEW WORK.....................................

userRouter.post(
  "/review-rating-doctors/:doctorId",
  Token,
  authorized("Patient", "Admin"),
  submitReview
);

userRouter.get(
  "/found-doctor-ratings/:doctorId",
  Token,
  authorized("Patient", "Doctor"),
  getDoctorReviews
);

export default userRouter;
