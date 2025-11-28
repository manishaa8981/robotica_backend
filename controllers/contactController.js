const Contact = require("../models/contactModel");
const { responseHandler } = require("../helper/responseHandler");
const { sendEmail } = require("../utils/sendEmail");

const addContactQuery = async (req, res) => {
    try {
        const { firstName, lastName, email, mobileNumber, message } = req.body;

        if (!firstName || !lastName || !email || !mobileNumber || !message) {
            return responseHandler(res, 400, false, "All fields are required.");
        }

        const newContact = new Contact({
            firstName,
            lastName,
            email,
            mobileNumber,
            message,
        });

        await newContact.save();

        // Send email to admin
        await sendEmail({
            email: process.env.ADMIN_EMAIL, // Admin email
            subject: "New Contact Query",
            template: "contactTemplate", // Reference template name
            data: {
                firstName,
                lastName,
                email,
                mobileNumber,
                message,
            },
        });

        return responseHandler(res, 201, true, "Email has been sent.", newContact);
    } catch (error) {
        console.log("Error in addContactQuery:", error);
        return responseHandler(res, 500, false, "An error occurred while processing your request.");
    }
};

const getAllContacts = async (req, res) => {
    try {
        let { page } = req.query;
        page = parseInt(page) || 1;
        const limit = 12;
        const skip = (page - 1) * limit;

        const contacts = await Contact.find().skip(skip).limit(limit);
        const totalContacts = await Contact.countDocuments();

        return responseHandler(res, 200, true, "Contacts fetched successfully.", { contacts, totalContacts, page, limit });
    } catch (error) {
        console.log("Error in getAllContacts:", error);
        return responseHandler(res, 500, false, "An error occurred while processing your request.");
    }
};

const getContactById = async (req, res) => {
    try {
        const { id } = req.params;
        const contact = await Contact.findById(id);
        if (!contact) {
            return responseHandler(res, 404, false, "Contact not found.");
        }
        return responseHandler(res, 200, true, "Contact fetched successfully.", contact);
    } catch (error) {
        console.log("Error in getContactById:", error);
        return responseHandler(res, 500, false, "An error occurred while processing your request.");
    }
};

module.exports = {
    addContactQuery,
    getAllContacts,
    getContactById,
};
