const Faq = require("../models/faqModel");
const { responseHandler } = require("../helper/responseHandler");

// Create FAQ
const createFaq = async (req, res) => {
  try {
    const { question, answer, category, order } = req.body;

    if (!question || !answer) {
      return responseHandler(
        res,
        400,
        false,
        "Question and answer are required.",
        null
      );
    }

    const faq = new Faq({
      question,
      answer,
      category,
      order,
    });

    await faq.save();

    return responseHandler(res, 201, true, "FAQ created successfully.", faq);
  } catch (error) {
    console.error("Error in createFaq:", error);
    return responseHandler(
      res,
      500,
      false,
      "An error occurred while creating FAQ.",
      null
    );
  }
};

// Get all active FAQs (for frontend)
const getFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    return responseHandler(res, 200, true, "FAQs fetched successfully.", faqs);
  } catch (error) {
    console.error("Error in getFaqs:", error);
    return responseHandler(
      res,
      500,
      false,
      "An error occurred while fetching FAQs.",
      null
    );
  }
};

// Get all FAQs including inactive (for admin panel, optional)
const getAllFaqsAdmin = async (req, res) => {
  try {
    const faqs = await Faq.find().sort({ order: 1, createdAt: 1 });
    return responseHandler(res, 200, true, "All FAQs fetched successfully.", faqs);
  } catch (error) {
    console.error("Error in getAllFaqsAdmin:", error);
    return responseHandler(
      res,
      500,
      false,
      "An error occurred while fetching FAQs.",
      null
    );
  }
};

// Update FAQ
const updateFaq = async (req, res) => {
  try {
    const { faqId } = req.params;
    const { question, answer, category, order, isActive } = req.body;

    const faq = await Faq.findById(faqId);
    if (!faq) {
      return responseHandler(res, 404, false, "FAQ not found.", null);
    }

    if (question !== undefined) faq.question = question;
    if (answer !== undefined) faq.answer = answer;
    if (category !== undefined) faq.category = category;
    if (order !== undefined) faq.order = order;
    if (typeof isActive === "boolean") faq.isActive = isActive;

    await faq.save();

    return responseHandler(res, 200, true, "FAQ updated successfully.", faq);
  } catch (error) {
    console.error("Error in updateFaq:", error);
    return responseHandler(
      res,
      500,
      false,
      "An error occurred while updating FAQ.",
      null
    );
  }
};

// Delete FAQ
const deleteFaq = async (req, res) => {
  try {
    const { faqId } = req.params;

    const faq = await Faq.findById(faqId);
    if (!faq) {
      return responseHandler(res, 404, false, "FAQ not found.", null);
    }

    await faq.deleteOne();

    return responseHandler(res, 200, true, "FAQ deleted successfully.", null);
  } catch (error) {
    console.error("Error in deleteFaq:", error);
    return responseHandler(
      res,
      500,
      false,
      "An error occurred while deleting FAQ.",
      null
    );
  }
};

module.exports = {
  createFaq,
  getFaqs,
  getAllFaqsAdmin,
  updateFaq,
  deleteFaq,
};
