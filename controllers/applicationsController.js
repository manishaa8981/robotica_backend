const Application = require("../models/applicationsModel");
const { responseHandler } = require("../helper/responseHandler");
const { sendEmail } = require("../utils/sendEmail");

// PUBLIC – submit application form
const submitApplication = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      level,
      schoolOrCollege,
      city,
      message,
    } = req.body;

    if (!firstName || !lastName || !email || !mobileNumber || !level) {
      return responseHandler(
        res,
        400,
        false,
        "First name, last name, email, mobile number and programme are required."
      );
    }

    const application = await Application.create({
      firstName,
      lastName,
      email,
      mobileNumber,
      level,
      schoolOrCollege,
      city,
      message,
    });

    // Optional: send email notification to admin
    try {
      await sendEmail({
        email: process.env.ADMIN_EMAIL,
        subject: "New Application Submitted",
        template: "applicationTemplate", // create this template if you want
        data: {
          firstName,
          lastName,
          email,
          mobileNumber,
          level,
          schoolOrCollege,
          city,
          message,
        },
      });
    } catch (emailErr) {
      console.error("Error sending application email:", emailErr);
      // We won't fail the API just because email failed
    }

    return responseHandler(
      res,
      201,
      true,
      "Application submitted successfully.",
      application
    );
  } catch (err) {
    console.error("Error submitting application:", err);
    return responseHandler(
      res,
      500,
      false,
      "Failed to submit application."
    );
  }
};

// ADMIN – get all applications
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .lean();

    return responseHandler(
      res,
      200,
      true,
      "Applications fetched successfully.",
      applications
    );
  } catch (err) {
    console.error("Error fetching applications:", err);
    return responseHandler(res, 500, false, "Failed to fetch applications.");
  }
};

// ADMIN – update status / mark as read
const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isRead } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (typeof isRead === "boolean") updateData.isRead = isRead;

    const updated = await Application.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return responseHandler(res, 404, false, "Application not found.");
    }

    return responseHandler(
      res,
      200,
      true,
      "Application updated successfully.",
      updated
    );
  } catch (err) {
    console.error("Error updating application:", err);
    return responseHandler(res, 500, false, "Failed to update application.");
  }
};

// ADMIN – delete application
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Application.findByIdAndDelete(id);
    if (!deleted) {
      return responseHandler(res, 404, false, "Application not found.");
    }

    return responseHandler(
      res,
      200,
      true,
      "Application deleted successfully.",
      deleted
    );
  } catch (err) {
    console.error("Error deleting application:", err);
    return responseHandler(res, 500, false, "Failed to delete application.");
  }
};

module.exports = {
  submitApplication,
  getAllApplications,
  updateApplication,
  deleteApplication,
};
