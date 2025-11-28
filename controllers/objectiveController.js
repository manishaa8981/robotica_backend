const Objective = require("../models/objectiveModel");
const { responseHandler } = require("../helper/responseHandler");

const addObjective = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return responseHandler(res, 400, false, "Required fields");
        }

        const objective = new Objective({ title, description });
        await objective.save();

        return responseHandler(res, 201, true, "Objective added successfully.", objective);
    } catch (err) {
        return responseHandler(res, 500, false, "Server error.", err);
    }
};

const getObjectives = async (req, res) => {
    try {
        const objective = await Objective.find().sort({ createdAt: -1 });
        return responseHandler(res, 200, true, "Objectives fetched successfully.", objective);
    } catch (err) {
        return responseHandler(res, 500, false, "Server error.", err);
    }
};

const updateObjective = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const updated = await Objective.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );

        if (!updated) {
            return responseHandler(res, 404, false, "Objective not found.");
        }

        return responseHandler(res, 200, true, "Objective updated successfully.", updated);
    } catch (err) {
        return responseHandler(res, 500, false, "Server error.", err);
    }
};

const deleteObjective = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await Objective.findByIdAndDelete(id);

        if (!deleted) {
            return responseHandler(res, 404, false, "Objective not found.");
        }

        return responseHandler(res, 200, true, "Objective deleted successfully.");
    } catch (err) {
        return responseHandler(res, 500, false, "Server error.", err);
    }
};

module.exports = {
    addObjective,
    getObjectives,
    updateObjective,
    deleteObjective,
}