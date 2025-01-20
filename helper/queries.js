// Import necessary modules from AWS SDK
// DynamoDBClient: Basic client for connecting to DynamoDB
// DynamoDBDocumentClient: Simplified client for working with DynamoDB items as plain JavaScript objects
// GetCommand, PutCommand, UpdateCommand: Commands for fetching, inserting, and updating items
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

// Initialize DynamoDB Client
// The DynamoDBClient is configured with the region from environment variables
const dynamoDbClient = new DynamoDBClient({
  region: process.env.AWS_REGION,
});

// Create a document client for easier interaction with DynamoDB
// DynamoDBDocumentClient allows handling items as JavaScript objects
const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);

// Queries

/**
 * Retrieves a user by email from the "Users_New" table.
 * @param {string} email - The email address of the user to retrieve.
 * @returns {Promise<Object>} - The result of the GetCommand containing the user's details.
 */
const getUserByEmail = async (email) => {
  const params = {
    TableName: 'Users_New', // Name of the DynamoDB table
    Key: { email }, // Primary key for the user (email)
  };
  return dynamoDb.send(new GetCommand(params)); // Send a GetCommand to fetch the user
};

/**
 * Creates a new user in the "Users_New" table.
 * @param {Object} user - The user object to insert into the table.
 * @returns {Promise<Object>} - The result of the PutCommand indicating success or failure.
 */
const createUser = async (user) => {
  const params = {
    TableName: 'Users_New', // Name of the DynamoDB table
    Item: user, // The user object to store in the table
  };
  return dynamoDb.send(new PutCommand(params)); // Send a PutCommand to insert the user
};

/**
 * Updates the password for an existing user in the "Users_New" table.
 * @param {string} email - The email address of the user whose password is being updated.
 * @param {string} hashedPassword - The new hashed password to set for the user.
 * @returns {Promise<Object>} - The result of the UpdateCommand indicating success or failure.
 */
const updateUserPassword = async (email, hashedPassword) => {
  const params = {
    TableName: 'Users_New', // Name of the DynamoDB table
    Key: { email }, // Primary key for the user (email)
    UpdateExpression: 'set password = :password', // Expression to update the password attribute
    ExpressionAttributeValues: {
      ':password': hashedPassword, // Placeholder value for the new hashed password
    },
  };
  return dynamoDb.send(new UpdateCommand(params)); // Send an UpdateCommand to modify the password
};

// Export the functions for use in other parts of the application
module.exports = {
  getUserByEmail, // Fetch user details by email
  createUser, // Insert a new user
  updateUserPassword, // Update user password
};
