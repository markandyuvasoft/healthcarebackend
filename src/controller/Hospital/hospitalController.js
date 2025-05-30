import User from "../../model/Auth/AuthSchema.js";
import Hospital from "../../model/Hospital/hospitalSchema.js";

// FOR HOSPITAL PURPOSE..................................

export const createHospital = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      hospitalName,
      address,
      phoneNumber,
      hospitalEmail,
      website,
      establishedYear,
      registrationNumber,
      accreditation,
      bedCount,
      icuBed,
      departments,
      facilities,
      insurancePartners,
    } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in request" });
    }

    const checkHospital = await Hospital.findOne({ hospitalName });

    if (checkHospital) {
      return res.status(400).json({
        message: "An account with this hospital name already exists.",
      });
    }

    const newHospital = new Hospital({
      hospitalName,
      address,
      phoneNumber,
      hospitalEmail,
      website,
      establishedYear,
      registrationNumber,
      accreditation,
      bedCount,
      icuBed,
      departments,
      facilities,
      insurancePartners,
    });

    await newHospital.save();

    res.status(200).json({
      message: "new created hospital",
    });
  } catch (error) {
    console.error("hospital creation error:", error);
    res.status(500).json({
      message: "Internal server error during hospital creation.",
      error: error.message,
    });
  }
};

export const getAllHospital = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in request" });
    }

    const checkAllHospital = await Hospital.find({}).populate({
      path: "departments.head",
      select: "fullName profileImage experience",
    });

    res.status(200).json({
      message: "all hospital details",
      allHospitals: checkAllHospital,
    });
  } catch (error) {
    console.error("hospital getting error:", error);
    res.status(500).json({
      message: "Internal server error during hospital getting.",
      error: error.message,
    });
  }
};

export const foundHospitalDepartments = async (req, res) => {
  try {
    const userId = req.user.id;
    const { hospitalId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in request" });
    }

    const hospital = await Hospital.findById(hospitalId).populate({
      path: "departments.head",
      select: "fullName",
    });

    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const departments = hospital.departments || [];
    const departmentCount = departments.length;

    res.status(200).json({
      message: "Hospital departments retrieved successfully",
      departmentCount,
      departments,
    });
  } catch (error) {
    console.error("Error retrieving hospital departments:", error);
    res.status(500).json({
      message: "Internal server error while retrieving hospital departments.",
      error: error.message,
    });
  }
};

export const deleteHospital = async (req, res) => {
  try {
    const userId = req.user.id;

    const { hospitalId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in request" });
    }

    const checkDetails = await Hospital.findOneAndDelete({ _id: hospitalId });

    if (checkDetails) {
      res.status(200).json({
        message: "successfully deleted your hospital",
      });
    } else {
      res.status(404).json({
        message: "not found this hospital",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};


export const foundHospitalDoctors = async (req, res) => {
  
  try {
    const { hospitalId } = req.params;

    const hospital = await Hospital.findById(hospitalId);
    
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }

    const doctors = await User.find({
      hospitalId,
      role: "Doctor",
    }).populate({
      path : "hospitalId",
      select : "hospitalName"
    })
    .select("-password -mobileNumber -isEmail_verification -role -isForget -updated_details"); 

    res.status(200).json({
      message : "perticular hospital doctors",
      hospital: hospital.hospitalName,
      totalDoctors: doctors.length,
      doctors,
    })

  } catch (error) {
    console.error("Error fetching doctors by hospital:", error);
    res.status(500).json({ message: "Server error" });
  }
}

// FOR CHANGE ROLE PURPOSE
export const changeRole = async (req, res) => {
  try {
    const userId = req.user.id;

    const { patientId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in request" });
    }

    const checkPatient = await User.findOne({ _id: patientId });

    if (checkPatient) {
      await User.findOneAndUpdate(
        { _id: patientId },
        {
          $set: {
            role: "Doctor",
          },
        },
        { new: true }
      );

      return res.status(200).json({
        message: "Patient role changed",
      });
    }
  } catch (error) {
    console.error("Patient role error:", error);
    res.status(500).json({
      message: "Internal server error during Patient role.",
      error: error.message,
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in request" });
    }

    const getDetails = await User.find({}).select(
      "-password -isForget -otp -isEmail_verification -updated_details -numReviews -averageRating -workingHours -updated"
    );

    // const allPatient = getDetails.filter((c) => c.role === "Patient");

    res.status(200).json({
      message: "found all Patient",
      patientAll: getDetails,
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};

export const deletePatients = async (req, res) => {
  try {
    const userId = req.user.id;

    const { patientId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in request" });
    }

    const checkDetails = await User.findOneAndDelete({ _id: patientId });

    if (checkDetails) {
      res.status(200).json({
        message: "successfully deleted your patient",
      });
    } else {
      res.status(404).json({
        message: "not found this patient",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
    });
  }
};
