const { responseHandler } = require("../helper/responseHandler");
const institutionProfile = require("../models/institutionProfileModel");
const fs = require("fs");
const path = require("path");

const updateInstitutionProfile = async (req, res) => {
    try {
        const { email, location, number, facebook, threadLink, whatsapp, insta, linkedin, locationForMap } = req.body;
        const brochureFile = req.files?.brochure?.[0];
        const certificateFile = req.files?.certificate?.[0];
        const institutionCertificateFile = req.files?.institutionCertificate?.[0];


        if (!email || !location || !number) {
            return responseHandler(res, 400, false, 'Required fields.');
        }

        const existingContent = await institutionProfile.findOne();

        if (existingContent) {
            existingContent.email = email;
            existingContent.location = location;
            existingContent.number = number;
            existingContent.facebook = facebook;
            existingContent.threadLink = threadLink;
            existingContent.whatsapp = whatsapp;
            existingContent.insta = insta;
            existingContent.linkedin = linkedin;
            existingContent.locationForMap = locationForMap;

            if (brochureFile) {
                if (existingContent.brochure) {
                    const oldPath = path.join(__dirname, "../uploads", existingContent.brochure);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
                existingContent.brochure = brochureFile.filename;
            }

            if (certificateFile) {
                if (existingContent.certificate) {
                    const oldPath = path.join(__dirname, "../uploads", existingContent.certificate);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
                existingContent.certificate = certificateFile.filename;
            }

            if (institutionCertificateFile) {
                if (existingContent.institutionCertificate) {
                    const oldPath = path.join(__dirname, "../uploads", existingContent.institutionCertificate);
                    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
                }
                existingContent.institutionCertificate = institutionCertificateFile.filename;
            }


            await existingContent.save();
            return responseHandler(res, 200, true, 'Institution Profile updated successfully.', existingContent);
        } else {
            const newContent = new institutionProfile({
                email,
                location,
                number,
                facebook,
                threadLink,
                whatsapp,
                insta,
                linkedin,
                locationForMap,
                brochure: brochureFile ? brochureFile.filename : null,
                certificate: certificateFile ? certificateFile.filename : null,
                institutionCertificate: institutionCertificateFile ? institutionCertificateFile.filename : null,
            });

            await newContent.save();
            return responseHandler(res, 200, true, 'Institution Profile created successfully.', newContent);
        }
    } catch (error) {
        console.log('Error in updateInstitutionProfile:', error);
        return responseHandler(res, 500, false, 'An error occurred while processing your request.');
    }
};

const getInstitutionProfile = async (req, res) => {
    try {
        const content = await institutionProfile.findOne();
        return responseHandler(res, 200, true, 'Institution Profile fetched successfully.', content);
    } catch (error) {
        console.log('Error in getInstitutionProfile:', error);
        return responseHandler(res, 500, false, 'An error occurred while processing your request.');
    }
};

const deleteBrochure = async (req, res) => {
    try {
        const content = await institutionProfile.findOne();
        if (!content || !content.brochure) {
            return responseHandler(res, 404, false, 'No brochure found to delete.');
        }

        const filePath = path.join(__dirname, "../uploads", content.brochure);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        content.brochure = null;
        await content.save();

        return responseHandler(res, 200, true, 'Brochure deleted successfully.', content);
    } catch (error) {
        console.log('Error in deleteBrochure:', error);
        return responseHandler(res, 500, false, 'An error occurred while deleting brochure.');
    }
};

const deleteCertificate = async (req, res) => {
    try {
        const content = await institutionProfile.findOne();
        if (!content || !content.certificate) {
            return responseHandler(res, 404, false, 'No certificate found to delete.');
        }

        const filePath = path.join(__dirname, "../uploads", content.certificate);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        content.certificate = null;
        await content.save();

        return responseHandler(res, 200, true, 'Certificate deleted successfully.', content);
    } catch (error) {
        console.log('Error in deleteCertificate:', error);
        return responseHandler(res, 500, false, 'An error occurred while deleting certificate.');
    }
};

const deleteInstitutionCertificate = async (req, res) => {
    try {
        const content = await institutionProfile.findOne();
        if (!content || !content.institutionCertificate) {
            return responseHandler(res, 404, false, 'No institution certificate found to delete.');
        }

        const filePath = path.join(__dirname, "../uploads", content.institutionCertificate);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        content.institutionCertificate = null;
        await content.save();

        return responseHandler(res, 200, true, 'Institution Certificate deleted successfully.', content);
    } catch (error) {
        console.log('Error in deleteInstitutionCertificate:', error);
        return responseHandler(res, 500, false, 'An error occurred while deleting institution certificate.');
    }
};

module.exports = {
    updateInstitutionProfile,
    getInstitutionProfile,
    deleteBrochure,
    deleteCertificate,
    deleteInstitutionCertificate
};
