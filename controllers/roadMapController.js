const RoadMap = require("../models/roadMapModel");
const { responseHandler } = require("../helper/responseHandler");

// CREATE a new roadMap
const addRoadMap = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return responseHandler(res, 400, false, "Required fields");
        }

        const roadMap = new RoadMap({ title, description });
        await roadMap.save();

        return responseHandler(res, 201, true, "RoadMap added successfully.", roadMap);
    } catch (err) {
        return responseHandler(res, 500, false, "Server error.", err);
    }
};

// GET all roadMaps
const getRoadMaps = async (req, res) => {
    try {
        const roadMaps = await RoadMap.find().sort({ createdAt: -1 });
        return responseHandler(res, 200, true, "RoadMaps fetched successfully.", roadMaps);
    } catch (err) {
        return responseHandler(res, 500, false, "Server error.", err);
    }
};

// UPDATE a roadMap
const updateRoadMap = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const updated = await RoadMap.findByIdAndUpdate(
            id,
            { title, description },
            { new: true }
        );

        if (!updated) {
            return responseHandler(res, 404, false, "RoadMap not found.");
        }

        return responseHandler(res, 200, true, "RoadMap updated successfully.", updated);
    } catch (err) {
        return responseHandler(res, 500, false, "Server error.", err);
    }
};

// DELETE a roadMap
const deleteRoadMap = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await RoadMap.findByIdAndDelete(id);

        if (!deleted) {
            return responseHandler(res, 404, false, "RoadMap not found.");
        }

        return responseHandler(res, 200, true, "RoadMap deleted successfully.");
    } catch (err) {
        return responseHandler(res, 500, false, "Server error.", err);
    }
};

module.exports = {
    addRoadMap,
    getRoadMaps,
    updateRoadMap,
    deleteRoadMap,
}