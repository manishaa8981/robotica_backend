const { responseHandler } = require("../helper/responseHandler");
const Motto = require("../models/mottoModel");

const addOrUpdateMottoContent = async (req, res) => {
  try {
    const { motoTitle, missionText, visionText } = req.body;

    if (!motoTitle || !missionText || !visionText) {
      return responseHandler(res, 400, false, "Title, mission, and vision text are required.");
    }

    const existingContent = await Motto.findOne();

    if (existingContent) {
      existingContent.motoTitle = motoTitle;
      existingContent.mission = { text: missionText };
      existingContent.vision = { text: visionText };

      await existingContent.save();
      return responseHandler(res, 200, true, "Motto content updated successfully.", existingContent);
    } else {
      const newContent = new Motto({
        motoTitle,
        mission: { text: missionText },
        vision: { text: visionText },
      });

      await newContent.save();
      return responseHandler(res, 200, true, "Motto content created successfully.", newContent);
    }
  } catch (error) {
    console.log("Error in addOrUpdateMottoContent:", error);
    return responseHandler(res, 500, false, "An error occurred while processing your request.");
  }
};

const getMottoContent = async (req, res) => {
  try {
    const content = await Motto.findOne();
    return responseHandler(res, 200, true, "Motto content fetched successfully.", content);
  } catch (error) {
    console.log("Error in getMottoContent:", error);
    return responseHandler(res, 500, false, "An error occurred while processing your request.");
  }
};

module.exports = {
  addOrUpdateMottoContent,
  getMottoContent,
};
