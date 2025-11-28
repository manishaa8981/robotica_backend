
const Team = require("../models/teamModel");
const { responseHandler } = require("../helper/responseHandler");
const path = require("path");
const fs = require("fs");

// Create a new team member
const createTeamMember = async (req, res) => {
  try {
    const { name, role, email, number, facebook, threadLink, whatsapp, insta, linkedin } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !role || !image) {
      return responseHandler(res, 400, false, "Name, role, and image are required", null);
    }

    const newTeamMember = new Team({
      name,
      role,
      image,
      email,
      number,
      facebook,
      threadLink,
      whatsapp,
      insta,
      linkedin,
    });

    await newTeamMember.save();
    responseHandler(res, 201, true, "Team member created successfully", newTeamMember);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

// Get all team members
const getAllTeamMembers = async (req, res) => {
  try {
    const teamMembers = await Team.find();
    responseHandler(res, 200, true, "Team members fetched successfully", teamMembers);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

// Get team member
const getTeamMemberById = async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await Team.findById(id);
    if (!teamMember) {
      return responseHandler(res, 404, false, "Team member not found", null);
    }

    responseHandler(res, 200, true, "Team member fetched successfully", teamMember);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};


// Update a team member by ID
const updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      role,
      email,
      number,
      facebook,
      threadLink,
      whatsapp,
      insta,
      linkedin,
    } = req.body;

    const existingTeamMember = await Team.findById(id);
    if (!existingTeamMember) {
      return responseHandler(res, 404, false, "Team member not found", null);
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (email !== undefined) updateData.email = email;
    if (number !== undefined) updateData.number = number;
    if (facebook !== undefined) updateData.facebook = facebook;
    if (threadLink !== undefined) updateData.threadLink = threadLink;
    if (whatsapp !== undefined) updateData.whatsapp = whatsapp;
    if (insta !== undefined) updateData.insta = insta;
    if (linkedin !== undefined) updateData.linkedin = linkedin;

    if (req.file) {
      const newImage = req.file.filename;
      updateData.image = newImage;

      if (existingTeamMember.image) {
        const oldImagePath = path.join(__dirname, "../uploads", existingTeamMember.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedTeamMember = await Team.findByIdAndUpdate(id, updateData, { new: true });

    responseHandler(res, 200, true, "Team member updated successfully", updatedTeamMember);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await Team.findById(id);
    if (!teamMember) {
      return responseHandler(res, 404, false, "Team member not found", null);
    }

    if (teamMember.image) {
      const imagePath = path.join(__dirname, "../uploads", teamMember.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Team.findByIdAndDelete(id);

    responseHandler(res, 200, true, "Team member deleted successfully", null);
  } catch (error) {
    responseHandler(res, 500, false, "Server error", error.message);
  }
};

module.exports = {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  deleteTeamMember,
  updateTeamMember
}