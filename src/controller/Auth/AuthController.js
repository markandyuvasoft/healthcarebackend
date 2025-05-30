import User from "../../model/Auth/AuthSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import { sendOtpEmail } from "../../../utils/mail.js";
import Appointment from "../../model/Appointment/BookAppointmentSchema.js";
import moment from "moment";
import Review from "../../model/Rating/ratingSchema.js";
dotenv.config();

// FOR USER AUTH RELATED FUNCTIONS.................................

export const registerAuth = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      mobileNumber,
      address,
      gender,
      updated_details,
    } = req.body;

    const checkAuth = await User.findOne({ email });

    if (checkAuth) {
      return res.status(400).json({
        message: "An account with this email address already exists.",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const authUser = new User({
      fullName,
      email,
      password: hash,
      mobileNumber,
      address,
      gender,
      updated_details,
    });

    await authUser.save();

    res.status(200).json({
      message: "registration Successfully",
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Internal server error during registration.",
      error: error.message,
    });
  }
};

export const loginAuth = async (req, res) => {
  try {
    const { email, password, updated_details } = req.body;

    if (!email && !password) {
      return res.status(400).json({
        message: "enter the details",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email credentials.",
      });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Invalid password credentials.",
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.KEY, {
      expiresIn: "24h",
    });

    res.status(200).json({
      message: "Login successful!",
      authId: user._id,
      role: user.role,
      updated_details: user.updated_details,
      token,
    });
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({
      message: "Internal server error during login.",
      error: error.message,
    });
  }
};

export const getAuthDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in request" });
    }

    const getDetails = await User.findOne({ _id: userId })
      .populate({
        path: "hospitalId",
        select: "hospitalName",
      })
      .select("-password -isForget -otp");

    res.status(200).json({
      message: "auth details are:",
      authDetails: getDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};

// export const updateAuth = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const {
//       fullName,
//       mobileNumber,
//       address,
//       gender,
//       specilist,
//       experience,
//       workingHours,
//       aboutMe,
//       hospitalId,
//     } = req.body;

//     const profileImage = req.file ? req.file.filename : null;

//     const checkUser = await User.findOne({ _id: userId });

//     if (!checkUser) {
//       return res.status(404).json({
//         message: "Auth details not found",
//       });
//     }

//     const updatedUser = await User.findOneAndUpdate(
//       { _id: userId },
//       {
//         $set: {
//           fullName,
//           mobileNumber,
//           updated_details: true,
//           hospitalId,
//           address,
//           gender,
//           specilist,
//           experience,
//           workingHours,
//           aboutMe,
//           profileImage,
//         },
//       },
//       { new: true }
//     ).select("-password -email");

//     res.status(200).json({
//       message: "Profile updated successfully",
//       checkUser: updatedUser,
//     });
//   } catch (error) {
//     console.error("Update error:", error);
//     res.status(500).json({
//       message: "Internal server error",
//     });
//   }
// };

export const updateAuth = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      fullName,
      mobileNumber,
      address,
      gender,
      specilist,
      experience,
      workingHours,
      aboutMe,
      hospitalId,
    } = req.body;

    const checkUser = await User.findOne({ _id: userId });

    if (!checkUser) {
      return res.status(404).json({
        message: "Auth details not found",
      });
    }

    // Prepare update fields
    const updateFields = {
      fullName,
      mobileNumber,
      updated_details: true,
      hospitalId,
      address,
      gender,
      specilist,
      experience,
      workingHours,
      aboutMe,
    };

    // If image file is uploaded, add to update fields
    if (req.file && req.file.filename) {
      updateFields.profileImage = req.file.filename;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateFields },
      { new: true }
    ).select("-password -email");

    res.status(200).json({
      message: "Profile updated successfully",
      checkUser: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "enter the email",
      });
    }

    const checkEmail = await User.findOne({ email });

    if (!checkEmail) {
      return res.status(404).json({
        message: "email not found",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    checkEmail.otp = otp;
    checkEmail.otpExpires = otpExpires;
    await checkEmail.save();

    await sendOtpEmail(email, otp);

    res.status(200).json({
      message: "OTP sent to your email.",
    });
  } catch (error) {
    console.error("verify email error:", error);
    res.status(500).json({
      message: "Internal server error during verify email.",
      error: error.message,
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ message: "Please provide both email and OTP." });
    }

    const user = await User.findOne({ email, otp });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or OTP." });
    }

    if (user.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new one." });
    }

    let updateFields = {
      otp: "",
      isForget: true,
      otpExpires: null,
    };

    const updatedUser = await User.findOneAndUpdate(
      { email, otp },
      { $set: updateFields },
      { new: true }
    );

    res.status(200).json({
      message: "OTP verified successfully.",
      isEmail_verification: updateFields.isEmail_verification,
      isForget: updateFields.isForget,
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

export const reset_password = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const checkAuth = await User.findOne({ email });

    if (!checkAuth) {
      return res.status(400).json({
        message: "no details found",
      });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    const chnage = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          password: hash,
          isForget: false,
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: "reset password successfully",
    });
  } catch (error) {
    console.error("reset password error:", error);
    res.status(500).json({
      message: "Internal server error during reset password.",
      error: error.message,
    });
  }
};

// FOR USER BOOKING RELATED FUNCTIONS..............................

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const userId = req.user?.id;
    const { appointmentDate, appointmentTime } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in request" });
    }

    const startDateTime = moment(
      `${appointmentDate} ${appointmentTime}`,
      "DD-MM-YYYY HH:mm"
    );
    if (!startDateTime.isValid()) {
      return res.status(400).json({ message: "Invalid date or time format" });
    }

    const endDateTime = moment(startDateTime).add(30, "minutes");
    const formattedStartTime = startDateTime.format("HH:mm");
    const formattedEndTime = endDateTime.format("HH:mm");

    const overlappingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate,
      status: "scheduled",
      $or: [
        {
          appointmentTime: { $lt: formattedEndTime },
          appointmentEndTime: { $gt: formattedStartTime },
        },
      ],
    });

    if (overlappingAppointment) {
      return res.status(400).json({
        message: "Doctor is already booked during this time slot.",
      });
    }

    const newAppointment = new Appointment({
      doctorId,
      userId,
      appointmentDate,
      appointmentTime: formattedStartTime,
      appointmentEndTime: formattedEndTime,
    });

    await newAppointment.save();

    res.status(200).json({
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error booking appointment:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const foundAppointment = async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({ message: "User ID not found in request" });
  }

  const checkAppointment = await Appointment.find({ userId })
    .populate({
      path: "userId",
      select: "fullName profileImage",
    })
    .populate({
      path: "doctorId",
      select: "fullName profileImage",
    });

  const cancelAppointment = checkAppointment.filter(
    (c) => c.status === "cancelled"
  );
  const upcomingAppointment = checkAppointment.filter(
    (c) => c.status === "upcoming"
  );
  const scheduledAppointment = checkAppointment.filter(
    (c) => c.status === "scheduled"
  );
  const completeAppointment = checkAppointment.filter(
    (c) => c.status === "complete"
  );

  res.status(200).json({
    message: "your appointments",
    cancelAppointment: cancelAppointment,
    upcomingAppointment: upcomingAppointment,
    scheduledAppointment: scheduledAppointment,
    completeAppointment: completeAppointment,
  });
};

export const cancelDoctorAppointment = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { doctorId } = req.params;
    const { appointmentDate, appointmentTime, reason } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in request" });
    }

    const dateTime = moment(
      `${appointmentDate} ${appointmentTime}`,
      "DD-MM-YYYY HH:mm",
      true
    );

    const appointment = await Appointment.findOne({
      userId,
      doctorId,
      appointmentDate,
      appointmentTime,
      status: { $in: ["scheduled", "upcoming"] },
    });

    if (!appointment) {
      return res.status(404).json({
        message: "No matching appointment found to cancel",
      });
    }

    appointment.status = "cancelled";
    if (reason) {
      appointment.reason = reason;
    }

    await appointment.save();

    res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// FOR RATING REVIEW FUNCTIONS.....................................
export const submitReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const { doctorId } = req.params;
    const userId = req.user.id;

    const existingReview = await Review.findOne({
      doctorId,
      user: userId,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this doctor." });
    }

    const review = new Review({
      doctorId,
      user: userId,
      rating,
      reviewText,
    });
    await review.save();

    const reviews = await Review.find({ doctorId });

    const numReviews = reviews.length;
    const averageRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews;

    await User.findByIdAndUpdate(
      doctorId,
      {
        averageRating,
        numReviews,
      },
      { new: true }
    );

    res.status(200).json({ message: "Review submitted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorReviews = async (req, res) => {
 
  try {
    const { doctorId } = req.params;

    const reviews = await Review.find({ doctorId })
      .populate("user", "fullName profileImage")
      .populate("doctorId", "fullName profileImage");

    const numReviews = reviews.length;
    const averageRating =
      numReviews > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
        : 0;

    res.status(200).json({
      averageRating: averageRating.toFixed(1),
      numReviews,
      reviews,
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
