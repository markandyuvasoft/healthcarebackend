import User from "../../model/Auth/AuthSchema.js";

export const getAllDoctors = async (req, res) => {
    
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in request" });
    }

    const getDetails = await User.find({}).select("-password -isForget -otp");

     const allDoctors = getDetails.filter(
    (c) => c.role === "Doctor"
  );

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
