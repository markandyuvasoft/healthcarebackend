import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    appointmentDateTime: {
      type: Date,
      required: true,
    },

    appointmentEndTime: {
      type: Date,
      required: true,
    },

    reason : {
        type : String
    },

    status: {
      type: String,
      enum: ["upcoming", "scheduled", "complete",  "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);

export default Appointment;
