const nodemailer = require("nodemailer");
const { emailTemplates } = require("../templates/emailTemplates");

async function sendEmail({ template, data, email, subject }) {
  try {
    const emailTemplate = emailTemplates[template];

    if (!emailTemplate) {
      throw new Error(`Email template '${template}' not found.`);
    }

    let emailContent = emailTemplate;
    for (let key in data) {
      const placeholder = `{{${key}}}`;
      emailContent = emailContent.replace(new RegExp(placeholder, 'g'), data[key]);
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
      // service: process.env.SMTP_SERVICE,
    });

    const mailOptions = {
      from: email,
      to: process.env.ADMIN_EMAIL,
      subject: subject,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error); throw new Error("Email could not be sent.");
  }
}

module.exports = { sendEmail };

