const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const users = require("../models/userModel");

const connectDB = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Connected to Database");
    })
    .then(() => {
      initializeAdminAccount();
    });
};

const initializeAdminAccount = async () => {
  try {
    const existingUser = await users.findOne({
      email: "robotica.admin@gmail.com",
    });

    if (existingUser) {
      console.log("This Admin already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash("NIiz$19&4dfbv../4782#8981", 10);

    const newUser = new users({
      name: "Robotica Admin",
      email: "robotica.admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    await newUser.save();
    console.log("Admin created successfully.");
  } catch (error) {
    console.error("Error initializing Admin:", error);
  }
};

module.exports = connectDB;
