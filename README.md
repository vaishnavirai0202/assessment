# Express API

This is a simple API built using Node.js and Express, implementing user authentication with JWT (JSON Web Token) and rate limiting for protected routes. It uses DynamoDB for storing user data and AWS SES for sending password reset emails.

## Features

- **User Registration**: Users can register with an email, username, and password.
- **User Login**: Users can log in using their email and password, and get a JWT token.
- **Forgot Password**: Users can request a password reset link sent to their email.
- **Reset Password**: Users can reset their password by verifying the reset token.
- **Rate Limiting**: Protect certain routes from too many requests in a short time using rate limiting.

## Prerequisites

- Node.js (version 14 or above)
- AWS SES setup for sending emails
- AWS DynamoDB setup for storing user data
- Environment variables stored in a `.env` file

## Installation

1. Clone the repository:
   
   git clone https://github.com/vaishnavirai0202/assessment.git
