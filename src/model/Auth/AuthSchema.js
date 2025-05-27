import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
    },

    email: {
      type: String,
    },

    password: {
      type: String,
    },

    profileImage: {
      type: String,
    },

    mobileNumber: {
      type: Number,
    },

    otp: {
      type: Number,
    },

    isEmail_verification: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      default: "Patient",
      enum: ["Patient", "Doctor", "Admin"],
    },

    address: {
      permanentAddress: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      country: {
        type: String,
      },
    },

    gender: {
      type: String,
    },

    isForget: {
      type: Boolean,
      default: false,
    },

    specilist: {
      type: String,
    },

    experience: {
      type: String,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    updated_details : {
      type : Boolean,
      default : false
    },


    aboutMe: {
      type: String,
    },

    workingHours: [
      {
        day: {
          type: String,
        },
        time: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
