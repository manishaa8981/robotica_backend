// const Admissions = require("../models/admissionsModel");
// const { responseHandler } = require("../helper/responseHandler");

// // Helper: normalize string/array into clean string[]
// const toArray = (value) => {
//   if (!value) return [];
//   if (Array.isArray(value)) {
//     return value.map((v) => String(v).trim()).filter(Boolean);
//   }
//   // value is string (e.g. textarea) – split on newlines or semicolons
//   return String(value)
//     .split(/\r?\n|;/)
//     .map((v) => v.trim())
//     .filter(Boolean);
// };

// // POST /api/admissions
// const manageAdmissions = async (req, res) => {
//   try {
//     const { mainTitle, load, prerequisites, grading, badges } = req.body;

//     let doc = await Admissions.findOne();

//     if (!doc) {
//       // create new
//       doc = new Admissions({
//         mainTitle,
//         load: load || "",
//         prerequisites: toArray(prerequisites),
//         grading: toArray(grading),
//         badges: toArray(badges),
//       });
//       await doc.save();
//       return responseHandler(
//         res,
//         201,
//         true,
//         "Admissions created successfully",
//         doc
//       );
//     }

//     // update existing
//     if (typeof mainTitle !== "undefined") doc.mainTitle = mainTitle;
//     if (typeof load !== "undefined") doc.load = load;
//     if (typeof prerequisites !== "undefined")
//       doc.prerequisites = toArray(prerequisites);
//     if (typeof grading !== "undefined") doc.grading = toArray(grading);
//     if (typeof badges !== "undefined") doc.badges = toArray(badges);

//     await doc.save();
//     return responseHandler(
//       res,
//       200,
//       true,
//       "Admissions updated successfully",
//       doc
//     );
//   } catch (error) {
//     return responseHandler(res, 500, false, error.message, null);
//   }
// };

// // GET /api/admissions
// const getAdmissions = async (req, res) => {
//   try {
//     const doc = await Admissions.findOne();
//     if (!doc) {
//       return responseHandler(
//         res,
//         404,
//         false,
//         "Admissions data not found",
//         null
//       );
//     }
//     return responseHandler(
//       res,
//       200,
//       true,
//       "Admissions fetched successfully",
//       doc
//     );
//   } catch (error) {
//     return responseHandler(res, 500, false, error.message, null);
//   }
// };

// module.exports = {
//   manageAdmissions,
//   getAdmissions,
// };
// controllers/admissionsController.js
const Admissions = require("../models/admissionsModel");
const { responseHandler } = require("../helper/responseHandler");

// GET /api/admissions
const getAdmissions = async (req, res) => {
  try {
    const doc = await Admissions.findOne();
    if (!doc) {
      return responseHandler(
        res,
        404,
        false,
        "Admissions data not found",
        null
      );
    }
    return responseHandler(
      res,
      200,
      true,
      "Admissions data fetched successfully",
      doc
    );
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

// POST /api/admissions  (create or update single document)
const upsertAdmissions = async (req, res) => {
  try {
    const { mainTitle, load, prerequisites, grading, badges } = req.body;

    // normalise to arrays (even if you send single string)
    const dto = {
      mainTitle,
      load,
      prerequisites: Array.isArray(prerequisites)
        ? prerequisites
        : prerequisites
        ? prerequisites
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      grading: Array.isArray(grading)
        ? grading
        : grading
        ? grading
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      badges: Array.isArray(badges)
        ? badges
        : badges
        ? badges
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    };

    let doc = await Admissions.findOne();

    if (!doc) {
      doc = await Admissions.create(dto);
      return responseHandler(
        res,
        201,
        true,
        "Admissions data created successfully",
        doc
      );
    }

    Object.assign(doc, dto);
    await doc.save();

    return responseHandler(
      res,
      200,
      true,
      "Admissions data updated successfully",
      doc
    );
  } catch (error) {
    return responseHandler(res, 500, false, error.message, null);
  }
};

module.exports = {
  getAdmissions,
  upsertAdmissions,
};
