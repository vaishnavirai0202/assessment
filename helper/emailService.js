// Import necessary modules
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
require('dotenv').config();

// Create an instance of SES client
const sesClient = new SESClient({});

// Function to send email using SES SDK v3
const sendEmailWithSES = async (email, token) => {
  const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;
  
  const emailParams = {
    Source: process.env.EMAIL_ADDRESS, // Sender email (verified in SES)
    Destination: {
      ToAddresses: [email], // Recipient email
    },
    Message: {
      Subject: {
        Data: 'Password Reset',
      },
      Body: {
        Text: {
          Data: `To reset your password, please click on the following link: ${resetLink}`,
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(emailParams); // Create SendEmailCommand
    const data = await sesClient.send(command); // Send email using SES
    console.log('Email sent successfully:', data);
  } catch (err) {
    console.error('Error sending email:', err);
  }
};

// Export the function to be used in other parts of your application
module.exports = {
  sendEmailWithSES,
};
