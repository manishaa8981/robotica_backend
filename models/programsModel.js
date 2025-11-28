const mongoose = require("mongoose");

const OutcomeSchema = new mongoose.Schema({
  description: { type: String, required: true },
});

const UnitSchema = new mongoose.Schema({
  description: { type: String },
});

const SemesterSchema = new mongoose.Schema({
  title: { type: String, required: true },
  units: [UnitSchema],
  project: { type: String },
  tracks: [UnitSchema],
});

const ProgramsSchema = new mongoose.Schema({
  mainTitle: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String },
  duration: { type: String, required: true },
  learningOutcomes: [OutcomeSchema],
  semesters: [SemesterSchema],
  workPlacement: { type: String },
  internationalInternshipAccess: { type: String },
});

const Programs = mongoose.model("Programs", ProgramsSchema);
module.exports = Programs;
