const users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please recheck your requests",
    });
  }

  try {
    const existingUser = await users.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "This account does not exist in our records",
      });
    } else if (existingUser.role === "user") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: existingUser._id, role: existingUser.role },
      process.env.JWT_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      success: true,
      message: `Welcome ${existingUser.name}`,
      user: existingUser,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while logging in",
    });
  }
};

const getAdminById = async (req, res) => {
  const id = req.params.id;
  try {
    const adminDetail = await users.findById(id);
    res.status(200).json({
      success: true,
      message: "Admin Details fetched successfully",
      adminDetail,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = {
  loginUser,
  getAdminById
};
