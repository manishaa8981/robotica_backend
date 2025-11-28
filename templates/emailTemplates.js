const emailTemplates = {
  contactTemplate: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
          <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>New Contact Query</title>
          <style>
              body {
                  font-family: "Quicksand", sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  margin: 0;
                  background-color: #eef1ffff;
              }
              .email-container {
                  max-width: 600px;
                  background: #fff;
                  padding: 40px;
                  border-radius: 8px;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                  text-align: center;
              }
              .logo {
                  text-align: center;
                  margin-bottom: 20px;
              }
              #logo_img {
                  height: 80px;
              }
              .header {
                  background-color: #204081;
                  color: white;
                  padding: 15px;
              }
              .header h1 {
                  font-size: 22px;
                  margin: 0;
              }
              .header p {
                  font-size: 16px;
                  margin-top: 5px;
              }
              .content {
                  text-align: left;
                  font-weight: 500;
                  line-height: 1.6;
                  padding: 20px 0;
              }
              .footer {
                  margin-top: 30px;
                  text-align: left;
                  font-size: 14px;
                  color: #777;
              }
              hr {
                  border: none;
                  height: 1px;
                  background-color: #ddd;
                  margin: 20px 0;
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="logo">
                  <img src="http://localhost:3000/static/media/uk-colleges-logo.5e706bcb00308e0803c2.png" id="logo_img" alt="Company Logo" />
              </div>
              <div class="header">
                  <h1>New Contact Request</h1>
                  <p>A new contact form has been submitted.</p>
              </div>
              <div class="content">
                    <p><strong>Name:</strong> {{firstName}} {{lastName}}</p>
                    <p><strong>Email:</strong> {{email}}</p>
                    <p><strong>Mobile Number:</strong> {{mobileNumber}}</p>
                    <p><strong>Message:</strong></p>
                <div style="background-color: #f5f8ff; border-left: 4px solid #204081; padding: 10px; margin-top: 5px;">
                    {{message}}
                </div>
                </div>
              <hr>
              <div class="footer">
                  <p><b>Best Regards,</b></p>
                  <p>Your Team</p>
              </div>
          </div>
      </body>
      </html>
    `,
  applicationReceived: `
      <h1>Application Received</h1>
      <p>Dear {{name}},</p>
      <p>We have received your application. Here are the details you provided:</p>
      <p><strong>Email:</strong> {{email}}</p>
      <p><strong>Mobile Number:</strong> {{mobileNumber}}</p>
      <p><strong>Query:</strong> {{query}}</p>
      <p><strong>University:</strong> {{university}}</p>
      <p><strong>Message:</strong> {{message}}</p>
      <p>We will get back to you shortly.</p>
    `,
  courseApplyReceived: `
        <h1>Course Application Received</h1>
        <p>Dear {{fullName}},</p>
        <p>We have received your course application. Here are the details you provided:</p>
        <p><strong>Email:</strong> {{email}}</p>
        <p><strong>Phone Number:</strong> {{phoneNumber}}</p>
        <p><strong>Test Preparation:</strong> {{testPrep}}</p>
        <p>We will get back to you shortly.</p>
        `,
};

module.exports = { emailTemplates };
