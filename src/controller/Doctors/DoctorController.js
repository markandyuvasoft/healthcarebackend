import Appointment from "../../model/Appointment/BookAppointmentSchema.js";
import User from "../../model/Auth/AuthSchema.js";

export const getAllDoctors = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in request" });
    }

    const getDetails = await User.find({}).select("-password -isForget -otp");

    const allDoctors = getDetails.filter((c) => c.role === "Doctor");

    res.status(200).json({
      message: "found all doctors",
      doctorsAll: allDoctors,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};

export const foundDoctorAppointment = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const appointments = await Appointment.find({ doctorId })
      .populate({
        path: "userId",
        select: "fullName profileImage",
      })
      .populate({
        path: "doctorId",
        select: "fullName profileImage",
      });

    const cancelAppointment = appointments.filter(
      (appointment) => appointment.status === "cancelled"
    );
    const upcomingAppointment = appointments.filter(
      (appointment) => appointment.status === "upcoming"
    );
    const scheduledAppointment = appointments.filter(
      (appointment) => appointment.status === "scheduled"
    );
    const completeAppointment = appointments.filter(
      (appointment) => appointment.status === "complete"
    );

    const totalCompleteAppointments = await Appointment.countDocuments({
      doctorId,
      status: "complete",
    });

    res.status(200).json({
      message: "your appointments",
      cancelAppointment,
      upcomingAppointment,
      scheduledAppointment,
      completeAppointment,
      totalCompleteAppointments,
    });

  } catch (error) {
    console.error("Error found appointment:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
