const Programs = require("../models/programsModel");
const { responseHandler } = require("../helper/responseHandler");
const fs = require("fs");
const path = require("path");

// Create or Update Main Program Section
const managePrograms = async (req, res) => {
  try {
    const {
      mainTitle,
      title,
      duration,
      workPlacement,
      internationalInternshipAccess,
    } = req.body;
    const image = req.file ? req.file.filename : null;

    let program = await Programs.findOne();

    if (program) {
      // Update fields
      program.mainTitle = mainTitle || program.mainTitle;
      program.title = title || program.title;
      program.duration = duration || program.duration;
      program.workPlacement = workPlacement || program.workPlacement;
      program.internationalInternshipAccess =
        internationalInternshipAccess || program.internationalInternshipAccess;

      // Replace image
      if (image) {
        if (program.image) {
          const oldImagePath = path.join(
            __dirname,
            "../uploads",
            program.image
          );
          if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
        }
        program.image = image;
      }

      await program.save();
      return responseHandler(
        res,
        200,
        true,
        "Program updated successfully",
        program
      );
    } else {
      // Create new program section
      const newProgram = new Programs({
        mainTitle,
        title,
        duration,
        workPlacement,
        internationalInternshipAccess,
        image,
        learningOutcomes: [],
        semesters: [],
      });

      await newProgram.save();
      return responseHandler(
        res,
        201,
        true,
        "Program created successfully",
        newProgram
      );
    }
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

// Get Program Section
const getPrograms = async (req, res) => {
  try {
    const program = await Programs.findOne();
    if (!program)
      return responseHandler(res, 404, false, "No data found", null);

    return responseHandler(
      res,
      200,
      true,
      "Program retrieved successfully",
      program
    );
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

// ================= OUTCOMES CRUD =================

// Add Learning Outcome
const addOutcome = async (req, res) => {
  try {
    const { description } = req.body;

    const program = await Programs.findOne();
    if (!program)
      return responseHandler(res, 404, false, "Program not found", null);

    program.learningOutcomes.push({ description });
    await program.save();

    return responseHandler(
      res,
      201,
      true,
      "Outcome added successfully",
      program
    );
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

// Update Learning Outcome
const updateOutcome = async (req, res) => {
  try {
    const { outcomeId } = req.params;
    const { description } = req.body;

    const program = await Programs.findOne();
    if (!program)
      return responseHandler(res, 404, false, "Program not found", null);

    const outcome = program.learningOutcomes.id(outcomeId);
    if (!outcome)
      return responseHandler(res, 404, false, "Outcome not found", null);

    outcome.description = description || outcome.description;

    await program.save();
    return responseHandler(
      res,
      200,
      true,
      "Outcome updated successfully",
      program
    );
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

// Delete Learning Outcome
const deleteOutcome = async (req, res) => {
  try {
    const { outcomeId } = req.params;

    const program = await Programs.findOne();
    if (!program)
      return responseHandler(res, 404, false, "Program not found", null);

    program.learningOutcomes = program.learningOutcomes.filter(
      (o) => o._id.toString() !== outcomeId
    );

    await program.save();
    return responseHandler(
      res,
      200,
      true,
      "Outcome deleted successfully",
      program
    );
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

// ================= SEMESTER CRUD =================

// const addSemester = async (req, res) => {
//   try {
//     let { title, units, project, tracks } = req.body;

//     const program = await Programs.findOne();
//     if (!program)
//       return responseHandler(res, 404, false, "Program not found", null);

//     if (units && Array.isArray(units)) {
//       units = units.map((u) =>
//         typeof u === "string" ? { description: u } : u
//       );
//     } else {
//       units = [];
//     }

//       if (tracks && Array.isArray(tracks)) {
//       tracks = tracks.map((u) =>
//         typeof u === "string" ? { description: u } : u
//       );
//     } else {
//       tracks = [];
//     }

//     program.semesters.push({ title, units, project, tracks });
//     await program.save();

//     return responseHandler(
//       res,
//       201,
//       true,
//       "Semester added successfully",
//       program
//     );
//   } catch (error) {
//     return responseHandler(res, 500, false, error.message, null);
//   }
// };
const addSemester = async (req, res) => {
  try {
    let { title, units, project, tracks } = req.body;

    const program = await Programs.findOne();
    if (!program)
      return responseHandler(res, 404, false, "Program not found", null);

    // ----- units (your style) -----
    if (!Array.isArray(units)) {
      // if units is a single string or undefined, normalize to array
      units = units ? [units] : [];
    }
    units = units
      .map((u) => (typeof u === "string" ? u.trim() : u?.description?.trim()))
      .filter(Boolean) // remove empty ones
      .map((u) => ({ description: u }));

    // ----- tracks (your style) -----
    if (!Array.isArray(tracks)) {
      // if tracks is a single string or undefined, normalize to array
      tracks = tracks ? [tracks] : [];
    }
    tracks = tracks
      .map((t) => (typeof t === "string" ? t.trim() : t?.description?.trim()))
      .filter(Boolean)
      .map((t) => ({ description: t }));

    program.semesters.push({ title, units, project, tracks });
    await program.save();

    return responseHandler(
      res,
      201,
      true,
      "Semester added successfully",
      program
    );
  } catch (error) {
    console.error("addSemester error:", error);
    return responseHandler(res, 500, false, error.message, null);
  }
};

// Update Semester
// const updateSemester = async (req, res) => {
//   try {
//     const { semesterId } = req.params;
//     let { title, units, project, tracks } = req.body;

//     const program = await Programs.findOne();
//     if (!program)
//       return responseHandler(res, 404, false, "Program not found", null);

//     const semester = program.semesters.id(semesterId);
//     if (!semester)
//       return responseHandler(res, 404, false, "Semester not found", null);

//     semester.title = title || semester.title;
//     if (units && Array.isArray(units)) {
//       semester.units = units.map((u) =>
//         typeof u === "string" ? { description: u } : u
//       );
//     }

//     semester.project = project || semester.project;
//     // semester.tracks = tracks || semester.tracks;
//        if (tracks && Array.isArray(tracks)) {
//       semester.tracks = tracks.map((u) =>
//         typeof u === "string" ? { description: u } : u
//       );
//     }

//     await program.save();
//     return responseHandler(
//       res,
//       200,
//       true,
//       "Semester updated successfully",
//       program
//     );
//   } catch (error) {
//     return responseHandler(res, 500, false, error.message, null);
//   }
// };
const updateSemester = async (req, res) => {
  try {
    const { semesterId } = req.params;
    let { title, units, project, tracks } = req.body;

    const program = await Programs.findOne();
    if (!program)
      return responseHandler(res, 404, false, "Program not found", null);

    const semester = program.semesters.id(semesterId);
    if (!semester)
      return responseHandler(res, 404, false, "Semester not found", null);

    semester.title = title || semester.title;
    semester.project = project || semester.project;

    // ----- units (only if provided) -----
    if (units !== undefined) {
      if (!Array.isArray(units)) {
        units = units ? [units] : [];
      }
      semester.units = units
        .map((u) => (typeof u === "string" ? u.trim() : u?.description?.trim()))
        .filter(Boolean)
        .map((u) => ({ description: u }));
    }

    // ----- tracks (only if provided) -----
    if (tracks !== undefined) {
      if (!Array.isArray(tracks)) {
        tracks = tracks ? [tracks] : [];
      }
      semester.tracks = tracks
        .map((t) => (typeof t === "string" ? t.trim() : t?.description?.trim()))
        .filter(Boolean)
        .map((t) => ({ description: t }));
    }

    await program.save();
    return responseHandler(
      res,
      200,
      true,
      "Semester updated successfully",
      program
    );
  } catch (error) {
    console.error("updateSemester error:", error);
    return responseHandler(res, 500, false, error.message, null);
  }
};

// Delete Semester
const deleteSemester = async (req, res) => {
  try {
    const { semesterId } = req.params;

    const program = await Programs.findOne();
    if (!program)
      return responseHandler(res, 404, false, "Program not found", null);

    program.semesters = program.semesters.filter(
      (s) => s._id.toString() !== semesterId
    );

    await program.save();
    return responseHandler(
      res,
      200,
      true,
      "Semester deleted successfully",
      program
    );
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

// Export all controllers
module.exports = {
  managePrograms,
  getPrograms,
  addOutcome,
  updateOutcome,
  deleteOutcome,
  addSemester,
  updateSemester,
  deleteSemester,
};

// const Programs = require("../models/programsModel");
// const { responseHandler } = require("../helper/responseHandler");
// const fs = require("fs");
// const path = require("path");

// // Manage main section (no image here now)
// const managePrograms = async (req, res) => {
//     try {
//         const { mainTitle } = req.body;

//         let section = await Programs.findOne();
//         if (section) {
//             section.mainTitle = mainTitle || section.mainTitle;
//             await section.save();
//             return responseHandler(res, 200, true, "Section updated successfully", section);
//         } else {
//             const newSection = new Programs({ mainTitle, items: [] });
//             await newSection.save();
//             return responseHandler(res, 201, true, "Section created successfully", newSection);
//         }
//     } catch (error) {
//         return responseHandler(res, 500, false, error.message, null);
//     }
// };

// // Get section
// const getPrograms = async (req, res) => {
//     try {
//         const section = await Programs.findOne();
//         if (!section) return responseHandler(res, 404, false, "No data found", null);
//         return responseHandler(res, 200, true, "Section retrieved successfully", section);
//     } catch (error) {
//         return responseHandler(res, 500, false, error.message, null);
//     }
// };

// // Add new item with image
// const addItem = async (req, res) => {
//     try {
//         const { mainId } = req.params;
//         const { title, description } = req.body;
//         const image = req.file ? req.file.filename : null;

//         if (!image) return responseHandler(res, 400, false, "Item image is required", null);

//         const section = await Programs.findById(mainId);
//         if (!section) return responseHandler(res, 404, false, "Main section not found", null);

//         const MAX_ITEMS = 9;
//         if (section.items.length >= MAX_ITEMS) {
//             return responseHandler(res, 400, false, `Maximum of ${MAX_ITEMS} items allowed`, null);
//         }

//         section.items.push({ title, description, image });
//         await section.save();
//         return responseHandler(res, 201, true, "Item added successfully", section);
//     } catch (error) {
//         return responseHandler(res, 500, false, error.message, null);
//     }
// };

// // Update item (title, description, optional image)
// const updateItem = async (req, res) => {
//     try {
//         const { itemId } = req.params;
//         const { title, description } = req.body;
//         const image = req.file ? req.file.filename : null;

//         const section = await Programs.findOne();
//         if (!section) return responseHandler(res, 404, false, "Main section not found", null);

//         const itemIndex = section.items.findIndex((i) => i._id.toString() === itemId);
//         if (itemIndex === -1) return responseHandler(res, 404, false, "Item not found", null);

//         const item = section.items[itemIndex];

//         // Replace old image if new image uploaded
//         if (image && item.image) {
//             const oldImagePath = path.join(__dirname, "../uploads", item.image);
//             if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
//             item.image = image;
//         }

//         item.title = title || item.title;
//         item.description = description || item.description;

//         await section.save();
//         return responseHandler(res, 200, true, "Item updated successfully", section);
//     } catch (error) {
//         return responseHandler(res, 500, false, error.message, null);
//     }
// };

// // Delete item and its image
// const deleteItem = async (req, res) => {
//     try {
//         const { itemId } = req.params;
//         const section = await Programs.findOne();
//         if (!section) return responseHandler(res, 404, false, "Main section not found", null);

//         const item = section.items.find((i) => i._id.toString() === itemId);
//         if (!item) return responseHandler(res, 404, false, "Item not found", null);

//         // Delete image file
//         if (item.image) {
//             const imagePath = path.join(__dirname, "../uploads", item.image);
//             if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
//         }

//         section.items = section.items.filter((i) => i._id.toString() !== itemId);
//         await section.save();

//         return responseHandler(res, 200, true, "Item deleted successfully", section);
//     } catch (error) {
//         return responseHandler(res, 500, false, error.message, null);
//     }
// };

// module.exports = {
//     managePrograms,
//     getPrograms,
//     addItem,
//     updateItem,
//     deleteItem,
// };
