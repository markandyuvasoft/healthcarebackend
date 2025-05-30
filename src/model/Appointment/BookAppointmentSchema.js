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

    appointmentDate: {
      type: String,
      required: true,
    },

    appointmentTime: {
      type: String,
      required: true,
    },

    appointmentEndTime: {
      type: String,
      required: true,
    },

    reason: {
      type: String,
    },

    status: {
      type: String,
      enum: ["upcoming", "scheduled", "complete", "cancelled"],
      default: "upcoming",
    },

    selectPackage: [
      {
        durationTime: {
          type: String,
        },

        packageName: {
          type: String,
        },
        packagePrice: {
          type: String,
        },
      },
    ],

    yourProblem: {
      type: String,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);

export default Appointment;
