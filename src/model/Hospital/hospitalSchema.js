import mongoose from "mongoose";

const HospitalSchema = new mongoose.Schema(
  {
    hospitalName: { type: String },

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

    phoneNumber: { type: String },
    hospitalEmail: { type: String },
    website: { type: String },
    establishedYear: { type: Number },
    registrationNumber: { type: String },
    accreditation: {
      NABH: { type: Boolean, default: false },
      JCI: { type: Boolean, default: false },
      ISO: { type: Boolean, default: false },
    },

    bedCount: { type: Number },

    icuBed: {
      type: Number,
    },

    departments: [
      {
        name: { type: String },
        head: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],

    facilities: {
      emergency: { type: Boolean, default: false },
      pharmacy: { type: Boolean, default: false },
      ambulance: { type: Boolean, default: false },
      laboratory: { type: Boolean, default: false },
      radiology: { type: Boolean, default: false },
      bloodBank: { type: Boolean, default: false },
    },

    insurancePartners: [{ type: String }],

    // location: {
    //   type: { type: String, enum: ["Point"], default: "Point" },
    //   coordinates: { type: [Number] }, // [longitude, latitude]
    // },
  },
  { timestamps: true }
);

const Hospital = mongoose.model("Hospital", HospitalSchema);

export default Hospital;
