// Import necessary modules
// The AWS SDK for SES (Simple Email Service) and dotenv module for environment variable management
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
require('dotenv').config(); // Loads environment variables from a .env file into process.env

// Create an instance of SES client
// This is used to interact with the AWS SES service for sending emails
const sesClient = new SESClient({});

// Function to send email using SES SDK v3
// Takes the recipient email address and a token as parameters
const sendEmailWithSES = async (email, token) => {
  // Construct the password reset link using the base URL from environment variables
  const resetLink = `${process.env.BASE_URL}/reset-password?token=${token}`;
  
  // Define email parameters for SES
  const emailParams = {
    Source: process.env.EMAIL_ADDRESS, // The sender's email address (must be verified in SES)
    Destination: {
      ToAddresses: [email], // Array of recipient email addresses
    },
    Message: {
      Subject: {
        Data: 'Password Reset', // Subject line of the email
      },
      Body: {
        Text: {
          Data: `To reset your password, please click on the following link: ${resetLink}`, // Email body (plain text)
        },
      },
    },
  };

  try {
    // Create a command to send the email
    const command = new SendEmailCommand(emailParams); 
    // Send the email using the SES client
    const data = await sesClient.send(command);
    // Log success message if the email is sent successfully
    console.log('Email sent successfully:', data);
  } catch (err) {
    // Log error message if there is an issue sending the email
    console.error('Error sending email:', err);
  }
};

// Export the function to be used in other parts of your application
// This allows the function to be imported and used elsewhere
module.exports = {
  sendEmailWithSES,
};
